import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

import { useListeners } from '../../internal/useListeners'
import { isHidden } from '../../libs/dom-utils'
import { focusWithoutScrolling } from '../../libs/dom-utils'
import type { BasePressEvent, PressSource } from '../../shared/types'
import { PressProps } from './types'
import { createPressEvent } from './utils/create-press-event'
import { isTargetContainsPoint } from './utils/detect-overlap'
import { isCheckableInput, isValidKeyboardEvent } from './utils/keyboard-event'
import { disableTextSelection, restoreTextSelection } from './utils/text-selection'
import { getTouchById, getTouchFromEvent } from './utils/touch-event'

export interface UsePressResult<T> {
  isPressed: boolean
  pressProps: HTMLAttributes<T>
}

type PressCache<T> = {
  currentPointerId: number | null
  currentPointerTarget: T
  isPressed: boolean
  isPressStarted: boolean
}

export function usePress<T extends HTMLElement = HTMLElement>(
  props: PressProps<T>,
): UsePressResult<T> {
  const { preventFocusOnPress } = props
  const { addListener, removeAllListeners } = useListeners()
  const [isPressed, setPressed] = useState(false)
  const cacheRef = useRef<PressCache<T>>({
    currentPointerId: null,
    // Expect that the currentTarget is always exists
    currentPointerTarget: null as unknown as T,
    isPressed: false,
    isPressStarted: false,
  })
  const propsRef = useRef<PressProps<T>>({})
  // Use ref as cache for reuse props inside memo hook.
  propsRef.current = {
    disabled: props.disabled,
    onPressStart: props.onPressStart,
    onPressUp: props.onPressUp,
    onPressEnd: props.onPressEnd,
    onPress: props.onPress,
  }

  const pressProps = useMemo(() => {
    const cache = cacheRef.current
    const props: HTMLAttributes<T> = {
      onKeyDown: (event) => {
        if (isValidKeyboardEvent(event.nativeEvent)) {
          // Use preventDefault for all elements except checkbox and radiobox inputs,
          // because input should trigger onChange after keydown.
          if (!isCheckableInput(event.target as HTMLElement)) {
            // Use preventDefault for stop document scroll for interactive elements.
            event.preventDefault()
          }

          event.stopPropagation()

          if (!cache.isPressed && !event.repeat) {
            triggerPressStart(createPressEvent(event, event.currentTarget, 'keyboard'))
          }
        }
      },

      // TODO: Register as global listener after keydown.
      onKeyUp: (event) => {
        if (isValidKeyboardEvent(event.nativeEvent) && !event.repeat) {
          triggerPressUp(createPressEvent(event, event.currentTarget, 'keyboard'))
          triggerPressEnd(createPressEvent(event, event.currentTarget, 'keyboard'))
        }
      },
    }

    const triggerPressStart = (event: BasePressEvent<T>) => {
      const { disabled, onPressStart } = propsRef.current

      if (disabled || cache.isPressStarted) {
        return
      }

      setPressed(true)
      cache.isPressStarted = true

      onPressStart?.({ ...event, type: 'pressstart' })
    }

    const triggerPressUp = (event: BasePressEvent<T>) => {
      const { disabled, onPressUp } = propsRef.current

      if (disabled) {
        return
      }

      onPressUp?.({ ...event, type: 'pressup' })
    }

    const triggerPressEnd = (event: BasePressEvent<T>, triggerOnPress = true) => {
      const { onPress, onPressEnd } = propsRef.current

      if (!cache.isPressStarted) {
        return
      }

      setPressed(false)
      cache.isPressStarted = false

      onPressEnd?.({ ...event, type: 'pressend' })

      if (triggerOnPress) {
        onPress?.({ ...event, type: 'press' })
      }
    }

    const attach = (target: T, id: number) => {
      cache.currentPointerTarget = target
      cache.currentPointerId = id
      cache.isPressed = true

      disableTextSelection()
      setPressed(true)
    }

    const detach = () => {
      if (cache.isPressed) {
        cache.isPressed = false

        restoreTextSelection()
        setPressed(false)
        removeAllListeners()
      }
    }

    if (typeof PointerEvent !== 'undefined') {
      const onPointerMove = (event: PointerEvent) => {
        const pointerType = event.pointerType as PressSource

        if (isTargetContainsPoint(cache.currentPointerTarget, event)) {
          triggerPressStart(createPressEvent(event, cache.currentPointerTarget, pointerType))
        } else {
          triggerPressEnd(createPressEvent(event, cache.currentPointerTarget, pointerType), false)
        }
      }

      const onPointerUp = (event: PointerEvent) => {
        // Dispose press only if down and up pointer ids are matches.
        if (event.pointerId === cache.currentPointerId) {
          detach()

          if (isTargetContainsPoint(cache.currentPointerTarget, event)) {
            const pointerType = event.pointerType as PressSource

            triggerPressUp(createPressEvent(event, cache.currentPointerTarget, pointerType))
            triggerPressEnd(createPressEvent(event, cache.currentPointerTarget, pointerType))

            // Preventing extraneous click on the wrong element when tapping on overlay elements
            event.target?.addEventListener(
              'touchend',
              (e) => {
                const target = e.target as HTMLElement

                if (!document.body.contains(target) || isHidden(target)) {
                  e.preventDefault()
                }
              },
              {
                once: true,
                passive: false,
              },
            )
          }
        }
      }

      // Cancel event can be fired while scroll.
      const onPointerCancel = (event: PointerEvent) => {
        if (cache.isPressed) {
          const pointerType = event.pointerType as PressSource

          triggerPressEnd(createPressEvent(event, cache.currentPointerTarget, pointerType), false)
        }
        detach()
      }

      // fixes iOS VoiceOver bug when unexpected mouseDown event is fired and propagated to body (https://github.com/use-platform/use-platform/issues/205)
      props.onMouseDown = (event) => {
        event.stopPropagation()
      }

      props.onPointerDown = (event) => {
        const { disabled } = propsRef.current

        // Handle only left clicks.
        if (event.button !== 0) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        if (!cache.isPressed && !disabled) {
          if (!preventFocusOnPress) {
            focusWithoutScrolling(event.currentTarget)
          }

          attach(event.currentTarget, event.pointerId)
          triggerPressStart(createPressEvent(event, event.currentTarget, event.pointerType))

          addListener(document, 'pointermove', onPointerMove, false)
          addListener(document, 'pointerup', onPointerUp, false)
          addListener(document, 'pointercancel', onPointerCancel, false)
        }
      }
    } else {
      const onTouchMove = (event: TouchEvent) => {
        const touch = getTouchById(event, cache.currentPointerId)

        if (touch) {
          if (isTargetContainsPoint(cache.currentPointerTarget, touch)) {
            triggerPressStart(createPressEvent(event, cache.currentPointerTarget, 'touch'))
          } else {
            triggerPressEnd(createPressEvent(event, cache.currentPointerTarget, 'touch'), false)
          }
        }
      }

      const onTouchEnd = (event: TouchEvent) => {
        const touch = getTouchById(event, cache.currentPointerId)

        // Dispose press only if down and up pointer ids are matches.
        if (touch?.identifier === cache.currentPointerId) {
          detach()

          if (isTargetContainsPoint(cache.currentPointerTarget, touch)) {
            triggerPressUp(createPressEvent(event, cache.currentPointerTarget, 'touch'))
            triggerPressEnd(createPressEvent(event, cache.currentPointerTarget, 'touch'))
          }
        }
      }

      // Cancel event can be fired while scroll.
      const onTouchCancel = (event: TouchEvent) => {
        if (cache.isPressed) {
          triggerPressEnd(createPressEvent(event, cache.currentPointerTarget, 'touch'), false)
        }
        detach()
      }

      props.onTouchStart = (event) => {
        const { disabled } = propsRef.current

        event.preventDefault()
        event.stopPropagation()

        const touch = getTouchFromEvent(event.nativeEvent)

        if (touch && !cache.isPressed && !disabled) {
          if (!preventFocusOnPress) {
            focusWithoutScrolling(event.currentTarget)
          }

          attach(event.currentTarget, touch.identifier)
          triggerPressStart(createPressEvent(event, event.currentTarget, 'touch'))

          addListener(document, 'touchmove', onTouchMove, false)
          addListener(document, 'touchend', onTouchEnd, false)
          addListener(document, 'touchcancel', onTouchCancel, false)
        }
      }
    }

    return props
  }, [addListener, preventFocusOnPress, removeAllListeners])

  useEffect(() => {
    return restoreTextSelection
  }, [])

  return {
    isPressed,
    pressProps,
  }
}

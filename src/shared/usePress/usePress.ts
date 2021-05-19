import { HTMLAttributes, useState, useMemo, useRef, useEffect } from 'react'

import { focusWithoutScrolling } from '../../libs/dom-utils'
import { useListeners } from '../../libs/useListeners'
import { isValidKeyboardEvent } from './utils/keyboard-event'
import { getTouchById, getTouchFromEvent } from './utils/touch-event'
import { disableTextSelection, restoreTextSelection } from './utils/text-selection'

export interface UsePressProps {
  disabled?: boolean
}

export interface UsePressResult<T> {
  pressed: boolean
  pressProps: HTMLAttributes<T>
}

type PressCache = {
  currentPointerId: number | null
  currentPointerTarget: HTMLElement | null
  pressed: boolean
}

export function usePress<T extends HTMLElement = HTMLElement>(
  props: UsePressProps,
): UsePressResult<T> {
  const { addListener, removeAllListeners } = useListeners()
  const [pressed, setPressed] = useState(false)
  const cacheRef = useRef<PressCache>({
    currentPointerId: null,
    currentPointerTarget: null,
    pressed: false,
  })
  const propsRef = useRef<UsePressProps>({})
  propsRef.current = { disabled: props.disabled }

  const pressProps = useMemo(() => {
    const cache = cacheRef.current
    const { disabled } = propsRef.current
    const props: HTMLAttributes<HTMLElement> = {
      onClick: (event) => {
        // Handle only left clicks.
        if (event.button !== 0) {
          return
        }

        event.stopPropagation()

        if (disabled) {
          event.preventDefault()
        } else {
          focusWithoutScrolling(event.currentTarget)
        }
      },

      onMouseDown: (event) => {
        // Handle only left clicks.
        if (event.button !== 0) {
          return
        }

        // Prevent blur while component is focused for safari and firefox browsers.
        event.preventDefault()
        event.stopPropagation()
      },

      onKeyDown: (event) => {
        if (isValidKeyboardEvent(event.nativeEvent)) {
          event.preventDefault()
          event.stopPropagation()

          if (!cache.pressed && !event.repeat) {
            setPressed(true)
          }
        }
      },

      onKeyUp: (event) => {
        if (isValidKeyboardEvent(event.nativeEvent) && !event.repeat) {
          setPressed(false)
        }
      },
    }

    const attach = (target: HTMLElement, id: number) => {
      cache.currentPointerTarget = target
      cache.currentPointerId = id
      cache.pressed = true

      disableTextSelection()
      setPressed(true)
    }

    const detach = () => {
      if (cache.pressed) {
        cache.pressed = false

        restoreTextSelection()
        setPressed(false)
        removeAllListeners()
      }
    }

    // Cancel event can be fired while scroll.
    const onPointerCancel = () => {
      detach()
    }

    if (typeof PointerEvent !== 'undefined') {
      const onPointerMove = (event: PointerEvent) => {
        // Calculate pointer target because event.target returns for ios always first target.
        const target = document.elementFromPoint(event.clientX, event.clientY)

        if (cache.currentPointerTarget?.contains(target)) {
          setPressed(true)
        } else {
          setPressed(false)
        }
      }

      const onPointerUp = (event: PointerEvent) => {
        // Dispose press only if down and up pointer ids are matches.
        if (event.pointerId === cache.currentPointerId) {
          detach()
        }
      }

      props.onPointerDown = (event) => {
        // Handle only left clicks.
        if (event.button !== 0) {
          return
        }

        event.preventDefault()
        event.stopPropagation()

        if (!cache.pressed) {
          attach(event.currentTarget, event.pointerId)

          addListener(document, 'pointermove', onPointerMove, false)
          addListener(document, 'pointerup', onPointerUp, false)
          addListener(document, 'pointercancel', onPointerCancel, false)
        }
      }
    } else {
      const onTouchMove = (event: TouchEvent) => {
        const touch = getTouchById(event, cache.currentPointerId)

        if (touch) {
          // Calculate pointer target because event.target returns for ios always first target.
          const target = document.elementFromPoint(touch.clientX, touch.clientY)

          if (cache.currentPointerTarget?.contains(target)) {
            setPressed(true)
          } else {
            setPressed(false)
          }
        }
      }

      const onTouchEnd = (event: TouchEvent) => {
        const touch = getTouchById(event, cache.currentPointerId)

        // Dispose press only if down and up pointer ids are matches.
        if (touch?.identifier === cache.currentPointerId) {
          detach()
        }
      }

      props.onTouchStart = (event) => {
        event.preventDefault()
        event.stopPropagation()

        const touch = getTouchFromEvent(event.nativeEvent)

        if (touch && !cache.pressed) {
          attach(event.currentTarget, touch.identifier)

          addListener(document, 'touchmove', onTouchMove, false)
          addListener(document, 'touchend', onTouchEnd, false)
          addListener(document, 'touchcancel', onPointerCancel, false)
        }
      }
    }

    return props
  }, [addListener, removeAllListeners])

  useEffect(() => {
    return restoreTextSelection
  }, [])

  return {
    pressed,
    pressProps,
  }
}

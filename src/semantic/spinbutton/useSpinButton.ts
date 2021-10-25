import { HTMLAttributes, useCallback, useRef, KeyboardEvent, useEffect } from 'react'

import { PressProps } from '../../interactions/press'

const STEP_DELAY = 400
const STEP_TIMEOUT = 70

export interface UseSpinButtonProps {
  min?: number
  max?: number
  value?: number
  textValue?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  onIncrement?: () => void
  onExtraIncrement?: () => void
  onDecrement?: () => void
  onExtraDecrement?: () => void
  onIncrementToMax?: () => void
  onDecrementToMin?: () => void
}

export interface UseSpinButtonResult<T extends HTMLElement> {
  spinButtonProps: HTMLAttributes<T>
  incrementButtonProps: PressProps<HTMLElement>
  decrementButtonProps: PressProps<HTMLElement>
}

export function useSpinButton<T extends HTMLElement = HTMLElement>(
  props: UseSpinButtonProps,
): UseSpinButtonResult<T> {
  const {
    value = NaN,
    min = NaN,
    max = NaN,
    textValue = Number.isFinite(value) ? value.toString() : '',
    disabled,
    readOnly,
    required,
    onIncrement,
    onExtraIncrement,
    onDecrement,
    onExtraDecrement,
    onDecrementToMin,
    onIncrementToMax,
  } = props
  const isInteractive = !(readOnly || disabled)
  const timerRef = useRef<number>()

  const onKeyDown = useCallback(
    (event: KeyboardEvent<T>) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return
      }

      const handlers: Record<string, (() => void) | undefined> = {
        ArrowUp: onIncrement,
        // fallback to increment
        PageUp: onExtraIncrement ?? onIncrement,
        ArrowDown: onDecrement,
        // fallback to decrement
        PageDown: onExtraDecrement ?? onDecrement,
        End: onIncrementToMax,
        Home: onDecrementToMin,
      }

      const handler = handlers[event.key]
      if (handler) {
        event.preventDefault()
        handler()
      }
    },
    [
      onIncrement,
      onExtraIncrement,
      onIncrementToMax,
      onDecrement,
      onExtraDecrement,
      onDecrementToMin,
    ],
  )

  const resetTimer = useCallback(() => clearTimeout(timerRef.current), [])

  const pressStartHandler = useCallback((callback?: () => void) => {
    function repeat(delay: number) {
      callback?.()
      timerRef.current = window.setTimeout(repeat, delay, STEP_TIMEOUT)
    }

    repeat(STEP_DELAY)
  }, [])

  const onIncrementPressStart = useCallback(() => {
    pressStartHandler(onIncrement)
  }, [pressStartHandler, onIncrement])

  const onDecrementPressStart = useCallback(() => {
    pressStartHandler(onDecrement)
  }, [pressStartHandler, onDecrement])

  useEffect(() => resetTimer, [resetTimer])

  const spinButtonProps: HTMLAttributes<T> = {
    role: 'spinbutton',
    'aria-valuenow': Number.isFinite(value) ? value : undefined,
    // TODO: localize message
    'aria-valuetext': textValue === '' ? 'Empty' : textValue,
    'aria-valuemin': Number.isFinite(min) ? min : undefined,
    'aria-valuemax': Number.isFinite(max) ? max : undefined,
    'aria-disabled': disabled || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-required': required || undefined,
  }

  if (isInteractive) {
    spinButtonProps.onKeyDown = onKeyDown
  }

  return {
    spinButtonProps,
    incrementButtonProps: {
      disabled: !isInteractive,
      onPressStart: onIncrementPressStart,
      onPressEnd: resetTimer,
    },
    decrementButtonProps: {
      disabled: !isInteractive,
      onPressStart: onDecrementPressStart,
      onPressEnd: resetTimer,
    },
  }
}

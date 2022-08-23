import { FocusEvent, HTMLAttributes, ReactNode, useCallback, useRef } from 'react'

export interface UseFocusWithinProps<T = HTMLElement> {
  disabled?: boolean
  onFocusWithin?: (event: FocusEvent<T>) => void
  onBlurWithin?: (event: FocusEvent<T>) => void
  onFocusWithinChange?: (isFocusWithin: boolean) => void
  children?: ReactNode
}

export interface UseFocusWithinResult<T> {
  focusWithinProps: HTMLAttributes<T>
}

export function useFocusWithin<T extends HTMLElement>(
  props: UseFocusWithinProps<T>,
): UseFocusWithinResult<T> {
  const propsRef = useRef(props)
  const stateRef = useRef({ within: false })
  propsRef.current = props

  const onFocus = useCallback((event: FocusEvent<T>) => {
    const { onFocusWithin, onFocusWithinChange } = propsRef.current
    const { current: state } = stateRef

    if (!state.within) {
      state.within = true

      onFocusWithin?.(event)
      onFocusWithinChange?.(true)
    }
  }, [])

  const onBlur = useCallback((event: FocusEvent<T>) => {
    const { onBlurWithin, onFocusWithinChange } = propsRef.current
    const { current: state } = stateRef

    if (state.within && !event.currentTarget.contains(event.relatedTarget as HTMLElement | null)) {
      state.within = false

      onBlurWithin?.(event)
      onFocusWithinChange?.(false)
    }
  }, [])

  const focusWithinProps: HTMLAttributes<T> = {}

  if (!props.disabled && (props.onFocusWithin || props.onBlurWithin || props.onFocusWithinChange)) {
    focusWithinProps.onFocus = onFocus
    focusWithinProps.onBlur = onBlur
  }

  return {
    focusWithinProps,
  }
}

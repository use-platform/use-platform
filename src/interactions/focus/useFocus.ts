import { FocusEvent, HTMLAttributes, ReactNode, useCallback, useRef } from 'react'

export interface UseFocusProps<T = HTMLElement> {
  disabled?: boolean
  onFocus?: (event: FocusEvent<T>) => void
  onBlur?: (event: FocusEvent<T>) => void
  onFocusChange?: (isFocused: boolean) => void
  children?: ReactNode
}

export interface UseFocusResult<T> {
  focusProps: HTMLAttributes<T>
}

export function useFocus<T extends HTMLElement>(props: UseFocusProps<T>): UseFocusResult<T> {
  const propsRef = useRef(props)
  propsRef.current = props

  const onFocus = useCallback((event: FocusEvent<T>) => {
    const { onFocus, onFocusChange } = propsRef.current

    if (event.target === event.currentTarget) {
      onFocus?.(event)
      onFocusChange?.(true)
    }
  }, [])

  const onBlur = useCallback((event: FocusEvent<T>) => {
    const { onBlur, onFocusChange } = propsRef.current

    if (event.target === event.currentTarget) {
      onBlur?.(event)
      onFocusChange?.(false)
    }
  }, [])

  const focusProps: HTMLAttributes<T> = {}

  if (!props.disabled) {
    if (props.onFocus || props.onFocusChange) {
      focusProps.onFocus = onFocus
    }

    if (props.onBlur || props.onFocusChange) {
      focusProps.onBlur = onBlur
    }
  }

  return {
    focusProps,
  }
}

import { InputHTMLAttributes, RefObject, TextareaHTMLAttributes } from 'react'

import { useFocusable } from '../../interactions/focusable'
import { setCursorToEnd } from '../../libs/dom-utils'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../libs/isomorphic-layout-effect'
import type { CommonTextFieldProps } from './types'

export interface UseTextFieldResult<T> {
  inputProps: T
}

export function useTextField<T extends HTMLInputElement | HTMLTextAreaElement>(
  props: CommonTextFieldProps,
  inputRef: RefObject<T>,
): T extends HTMLTextAreaElement
  ? UseTextFieldResult<TextareaHTMLAttributes<T>>
  : UseTextFieldResult<InputHTMLAttributes<T>> {
  const { as: elementType = 'input', type = 'text', autoComplete = 'off', ...restProps } = props
  const { focusableProps } = useFocusable(props, inputRef)

  let additionalProps: InputHTMLAttributes<HTMLInputElement> = {}

  if (elementType === 'input') {
    additionalProps = { type }
  }

  useLayoutEffect(() => {
    // By default autofocus set cursor at start position when element type is textarea.
    if (elementType === 'textarea') {
      setCursorToEnd(inputRef.current)
    }
  }, [elementType, inputRef, props.autoFocus])

  return {
    inputProps: {
      autoComplete,
      ...restProps,
      ...focusableProps,
      ...additionalProps,
    },
  } as any
}

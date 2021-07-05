import {
  ElementType,
  InputHTMLAttributes,
  RefObject,
  TextareaHTMLAttributes,
  useLayoutEffect,
} from 'react'

import { setCursorToEnd } from '../../libs/dom-utils'
import { useFocusable } from '../../interactions/focusable'
import type { CommonTextFieldProps } from './types'

export interface UseTextFieldResult {
  ElementType: ElementType
  inputProps: InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>
}

export function useTextField(
  props: CommonTextFieldProps,
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
): UseTextFieldResult {
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
    ElementType: elementType,
    inputProps: {
      autoComplete,
      ...restProps,
      ...focusableProps,
      ...additionalProps,
    },
  }
}

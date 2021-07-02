import { ElementType, InputHTMLAttributes, RefObject, TextareaHTMLAttributes } from 'react'

import { useFocusable } from '../../shared/useFocusable'
import type { CommonTextFieldProps } from './types'

export interface UseTextFieldResult {
  ElementType: ElementType
  inputProps: InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>
}

export function useTextField(
  props: CommonTextFieldProps,
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement>,
): UseTextFieldResult {
  const { as: elementType = 'input', type = 'text', autoComplete = 'off', ...restProps } = props
  const { focusableProps } = useFocusable(props, ref)

  let additionalProps: InputHTMLAttributes<HTMLInputElement> = {}

  if (elementType === 'input') {
    additionalProps = { type }
  }

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

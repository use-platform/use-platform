import { ElementType, InputHTMLAttributes, RefObject, TextareaHTMLAttributes, useRef } from 'react'

import { useFocusable } from '../../interactions/focusable'
import { setCursorToEnd } from '../../libs/dom-utils'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../libs/isomorphic-layout-effect'
import type { CommonTextFieldProps } from './types'

export interface TextFieldProps extends CommonTextFieldProps {
  elementType?: ElementType
}

export interface UseTextFieldResult<T> {
  inputProps: T
}

export function useTextField<T extends HTMLInputElement | HTMLTextAreaElement>(
  props: TextFieldProps,
  inputRef: RefObject<T>,
): T extends HTMLTextAreaElement
  ? UseTextFieldResult<TextareaHTMLAttributes<T>>
  : UseTextFieldResult<InputHTMLAttributes<T>> {
  const {
    elementType = 'input',
    type = 'text',
    autoComplete = 'off',
    onChange,
    onBlur,
    disabled,
    value,
    defaultValue,
    min,
    minLength,
    maxLength,
    max,
    readOnly,
    name,
    onFocus,
    placeholder,
    required,
    pattern,
    inputMode,
    id,
  } = props
  const { focusableProps } = useFocusable(props, inputRef)
  const propsRef = useRef({
    elementType,
    autoFocus: props.autoFocus,
    inputRef,
  })
  let additionalProps: InputHTMLAttributes<HTMLInputElement> = {}

  if (elementType === 'input') {
    additionalProps = { type }
  }

  useLayoutEffect(() => {
    // By default autofocus set cursor at start position when element type is textarea.
    if (propsRef.current.elementType === 'textarea' && propsRef.current.autoFocus) {
      setCursorToEnd(propsRef.current.inputRef.current)
    }
  }, [])

  return {
    inputProps: {
      disabled,
      value,
      defaultValue,
      min,
      minLength,
      maxLength,
      max,
      readOnly,
      name,
      placeholder,
      required,
      id,
      inputMode,
      pattern,
      'aria-activedescendant': props['aria-activedescendant'],
      'aria-autocomplete': props['aria-autocomplete'],
      'aria-haspopup': props['aria-haspopup'],
      'aria-multiline': props['aria-multiline'],
      'aria-placeholder': props['aria-placeholder'],
      'aria-readonly': props['aria-readonly'],
      'aria-required': required || undefined,
      onFocus,
      onChange,
      onBlur,
      autoComplete,
      ...focusableProps,
      ...additionalProps,
    },
  } as any
}

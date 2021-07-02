import { RefObject } from 'react'

import { focusWithoutScrolling } from '../../libs/dom-utils'
import type { ButtonBaseProps } from '../button'
import type { CommonTextFieldProps } from './types'

export interface UseClearButtonResult {
  isActive: boolean
  buttonProps: ButtonBaseProps
}

export function useClearButton(
  props: CommonTextFieldProps,
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
): UseClearButtonResult {
  const { onChange, value, disabled, readOnly } = props
  const isInteractive = !(readOnly || disabled)
  const isActive = isInteractive && Boolean(value)

  const onPress = () => {
    if (inputRef.current) {
      focusWithoutScrolling(inputRef.current)

      const syntheticEvent = Object.create({})
      syntheticEvent.target = inputRef.current
      syntheticEvent.currentTarget = inputRef.current
      inputRef.current.value = ''

      onChange?.(syntheticEvent)
    }
  }

  return {
    isActive,
    buttonProps: {
      disabled,
      onPress,
      preventFocusOnPress: true,
      tabIndex: -1,
    },
  }
}

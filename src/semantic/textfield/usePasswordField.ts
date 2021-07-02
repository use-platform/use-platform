import { RefObject, useState } from 'react'

import { focusWithoutScrolling, setCursorToEnd } from '../../libs/dom-utils'
import type { ButtonBaseProps } from '../useButton'
import type { TextFieldBaseProps } from './types'

export interface UsePasswordFieldResult {
  isShown: boolean
  buttonProps: ButtonBaseProps
  inputProps: TextFieldBaseProps
}

export function usePasswordField(
  props: TextFieldBaseProps,
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
): UsePasswordFieldResult {
  const { disabled } = props
  const [isShown, setShown] = useState(false)

  const onPress = () => {
    setShown(!isShown)

    if (inputRef.current) {
      focusWithoutScrolling(inputRef.current)
    }

    // Use raf for set cursor at the end after layout changed.
    requestAnimationFrame(() => {
      if (inputRef.current) {
        setCursorToEnd(inputRef.current)
      }
    })
  }

  return {
    isShown: isShown,
    buttonProps: {
      disabled,
      onPress,
      preventFocusOnPress: true,
      tabIndex: -1,
    },
    inputProps: {
      type: isShown ? 'text' : 'password',
    },
  }
}

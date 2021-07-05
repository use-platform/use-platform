import { HTMLAttributes, InputHTMLAttributes, RefObject } from 'react'

import { CommonToggleProps, useToggle } from '../toggle'

export interface UseSwitchResult {
  isPressed: boolean
  rootProps: HTMLAttributes<HTMLElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export function useSwitch(
  props: CommonToggleProps,
  inputRef: RefObject<HTMLInputElement>,
): UseSwitchResult {
  const toggle = useToggle(props, inputRef)

  return {
    ...toggle,
    inputProps: {
      ...toggle.inputProps,
      role: 'switch',
    },
  }
}

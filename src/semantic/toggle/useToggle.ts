import { HTMLAttributes, InputHTMLAttributes, RefObject } from 'react'

import { mergeProps } from '../../libs/merge-props'
import { isFirefox } from '../../libs/platform'
import { useFocusable } from '../../interactions/focusable'
import { usePress } from '../../interactions/press'
import type { CommonToggleProps } from './types'

interface UseToggleResult {
  isPressed: boolean
  rootProps: HTMLAttributes<HTMLElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

// TODO: Add validation for exists aria-label or aria-labelledby.
export function useToggle(
  props: CommonToggleProps,
  ref: RefObject<HTMLInputElement>,
): UseToggleResult {
  const { onChange, readOnly, state, ...restProps } = props
  const { focusableProps } = useFocusable(props, ref)
  const { isPressed, pressProps } = usePress(props)

  return {
    isPressed,
    rootProps: pressProps,
    inputProps: mergeProps(restProps, focusableProps, {
      'aria-invalid': state === 'invalid' || undefined,
      // Use "aria-readonly" because "readOnly" available only for text fields,
      // see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly.
      'aria-readonly': readOnly || undefined,
      // https://bugzilla.mozilla.org/show_bug.cgi?id=654072
      autoComplete: isFirefox() ? 'off' : undefined,
      onChange: readOnly ? undefined : onChange,
      type: 'checkbox',
    }),
  }
}

import { HTMLAttributes, InputHTMLAttributes, RefObject } from 'react'

import { mergeProps } from '../../libs/merge-props'
import { isFirefox } from '../../libs/platform'
import { useFocusable } from '../../shared/useFocusable'
import { useHover } from '../../shared/useHover'
import { usePress } from '../../shared/usePress'
import type { SharedToggleProps } from '../../shared/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UseToggleProps extends SharedToggleProps {}

interface UseToggleResult {
  pressed: boolean
  hovered: boolean
  rootProps: HTMLAttributes<HTMLElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

// TODO: Add validation for exists aria-label or aria-labelledby.
export function useToggle<T extends HTMLInputElement = HTMLInputElement>(
  props: UseToggleProps,
  ref: RefObject<T>,
): UseToggleResult {
  const { name, value, disabled, required, onChange, readOnly, state, ...restProps } = props
  const { focusableProps } = useFocusable(props, ref)
  const { pressed, pressProps } = usePress(props)
  const { isHovered: hovered, hoverProps } = useHover(props)

  return {
    pressed,
    hovered,
    rootProps: mergeProps(pressProps, hoverProps),
    inputProps: mergeProps(restProps, focusableProps, {
      'aria-controls': props['aria-controls'],
      'aria-errormessage': props['aria-errormessage'],
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

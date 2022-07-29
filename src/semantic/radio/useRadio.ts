import { ChangeEvent, HTMLAttributes, InputHTMLAttributes, RefObject } from 'react'

import { useFocusable } from '../../interactions/focusable'
import { usePress } from '../../interactions/press'
import { mergeProps } from '../../libs/merge-props'
import { isFirefox } from '../../libs/platform'
import { BaseRadioProps } from './types'
import { useRadioGroupContext } from './useRadioGroupContext'

export interface UseRadioResult {
  inputProps: InputHTMLAttributes<HTMLInputElement>
  isPressed: boolean
  rootProps: HTMLAttributes<HTMLElement>
}

export function useRadio(
  props: BaseRadioProps,
  inputRef: RefObject<HTMLInputElement>,
): UseRadioResult {
  const {
    checked: propChecked,
    defaultChecked,
    disabled,
    name,
    onChange,
    readOnly: propReadOnly,
    state,
    value,
  } = props
  const { focusableProps } = useFocusable(props, inputRef)
  const { isPressed, pressProps } = usePress(props)
  const radioGroupContext = useRadioGroupContext()
  const checked = radioGroupContext
    ? radioGroupContext.selectedValue === props.value
    : propChecked ?? defaultChecked
  const readOnly = radioGroupContext?.isReadOnly || propReadOnly

  if (radioGroupContext) {
    if (process.env.NODE_ENV !== 'production') {
      if (props.checked || props.defaultChecked) {
        console.warn('Using checked/defaultChecked prop with RadioGroupContext will have no effect')
      }

      if (props.onChange) {
        console.warn('Using onChange prop with RadioGroupContext will have no effect')
      }

      if (props.name) {
        console.warn('Using name prop with RadioGroupContext will have no effect')
      }
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (radioGroupContext) {
      radioGroupContext.setSelectedValue?.(event)
    } else {
      onChange?.(event)
    }
  }

  return {
    isPressed,
    rootProps: pressProps,
    inputProps: mergeProps(focusableProps, {
      type: 'radio',
      onChange: readOnly ? undefined : handleOnChange,
      'aria-invalid': state === 'invalid' || undefined,
      'aria-checked': checked || props.defaultChecked,
      // Use "aria-readonly" because "readOnly" available only for text fields,
      // see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly.
      'aria-readonly': readOnly || undefined,
      // https://bugzilla.mozilla.org/show_bug.cgi?id=654072
      autoComplete: isFirefox() ? 'off' : undefined,
      checked,
      name: radioGroupContext?.name ?? name,
      disabled: radioGroupContext?.isDisabled || disabled,
      value,
    }),
  }
}

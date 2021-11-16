import { InputHTMLAttributes, RefObject, useContext } from 'react'
import { RadioProps } from './types'
import { useFocusable } from '../../interactions/focusable'
import { mergeProps } from '../../libs/merge-props'
import { isFirefox } from '../../libs/platform'
import { RadioGroupContext } from './RadioGroupContext'

export interface UseRadioResult {
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export function useRadio(props: RadioProps, inputRef: RefObject<HTMLInputElement>): UseRadioResult {
  const { onChange: componentOnChange, readOnly: componentReadOnly, state, ...restProps } = props
  let readOnly = componentReadOnly
  const { focusableProps } = useFocusable(props, inputRef)
  const radioGroupContext = useContext(RadioGroupContext)
  let checked = props.checked
  let name = props.name
  let onChange = readOnly ? undefined : componentOnChange
  let disabled = props.disabled
  if (radioGroupContext) {
    if (process.env.NODE_ENV === 'development') {
      if (props.checked || props.defaultChecked) {
        console.warn('Using checked/defaultChecked prop with RadioGroupContext will have no effect')
      }

      if (props.onChange) {
        console.warn('Using onChange prop with RadioGroupContext will have no effect')
      }

      if (props.name) {
        console.warn('Using name prop with RadioGroupContext will have no effect')
      }

      if (props.readOnly !== undefined) {
        console.warn('Using readOnly prop with RadioGroupContext will have no effect')
      }
    }

    checked = radioGroupContext.selectedValue === props.value
    name = radioGroupContext.name
    disabled ||= radioGroupContext.disabled
    readOnly = radioGroupContext.readOnly
    onChange = () => {
      if (!radioGroupContext.readOnly) {
        radioGroupContext.setValue(props.value)
      }
    }
  }
  return {
    inputProps: mergeProps(restProps, focusableProps, {
      type: 'radio',
      onChange,
      'aria-invalid': state === 'invalid' || undefined,
      'aria-checked': checked || props.defaultChecked,
      // Use "aria-readonly" because "readOnly" available only for text fields,
      // see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly.
      'aria-readonly': readOnly || undefined,
      // https://bugzilla.mozilla.org/show_bug.cgi?id=654072
      autoComplete: isFirefox() ? 'off' : undefined,
      checked,
      name,
      disabled,
      readOnly,
    }),
  }
}

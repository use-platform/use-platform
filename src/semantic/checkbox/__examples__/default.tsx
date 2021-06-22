import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'
import { SharedCheckboxProps, useCheckbox } from '@yandex/web-platform'

export const Default = (args: any) => {
  const [checked, setChecked] = useState(false)
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }, [])

  return <Checkbox {...args} checked={checked} onChange={onChange} />
}

Default.args = {
  indeterminate: false,
  disabled: false,
  readOnly: false,
  required: false,
  name: 'checkbox',
  value: 'value',
  autoFocus: false,
} as SharedCheckboxProps

const Checkbox: FC<SharedCheckboxProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { pressed, hovered, rootProps, inputProps } = useCheckbox(props, inputRef)

  return (
    <label {...rootProps} style={{ opacity: pressed || props.disabled ? 0.5 : 1 }}>
      <input ref={inputRef} {...inputProps} />
      <span style={{ color: hovered ? 'green' : 'black' }}>Label</span>
    </label>
  )
}

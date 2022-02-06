import { SharedCheckboxProps, useCheckbox, useHover } from '@use-platform/react'
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'

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
  const { isPressed, rootProps, inputProps } = useCheckbox(props, inputRef)
  const { isHovered, hoverProps } = useHover(props)

  return (
    <label
      {...rootProps}
      {...hoverProps}
      style={{ opacity: isPressed || props.disabled ? 0.5 : 1 }}
    >
      <input ref={inputRef} {...inputProps} />
      <span style={{ color: isHovered ? 'green' : 'black' }}>Label</span>
    </label>
  )
}

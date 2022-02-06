import { TextFieldBaseProps, useButton, useClearButton, useTextField } from '@use-platform/react'
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'

export const Simple = (args: any) => {
  const [value, setValue] = useState('')
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  return <TextField {...args} value={value} onChange={onChange} />
}

Simple.argTypes = {
  type: {
    control: {
      type: 'radio',
      options: ['text', 'search', 'password'],
    },
  },
}

Simple.args = {
  autoFocus: false,
  disabled: false,
  name: 'textfield',
  readOnly: false,
  required: false,
  type: 'text',
} as TextFieldBaseProps

const TextField: FC<any> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps } = useTextField(props, inputRef)
  const { isActive, buttonProps } = useClearButton(props, inputRef)

  return (
    <div style={{ display: 'flex' }}>
      <input {...inputProps} ref={inputRef} />
      {isActive && <Button {...buttonProps}>clear</Button>}
    </div>
  )
}

const Button: FC<any> = (props) => {
  const { children } = props
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps, isPressed } = useButton(props, buttonRef)

  return (
    <button {...buttonProps} ref={buttonRef}>
      {children}
      {isPressed ? 'pressed' : ''}
    </button>
  )
}

import { useButton, usePasswordField, useTextField } from '@use-platform/react'
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'

export const Password = () => {
  const [value, setValue] = useState('')
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  return <PasswordField value={value} onChange={onChange} />
}

const PasswordField: FC<any> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps } = useTextField(props, inputRef)
  const { isShown, inputProps: passwordInputProps, buttonProps } = usePasswordField(props, inputRef)

  return (
    <div style={{ display: 'flex' }}>
      <input {...inputProps} {...passwordInputProps} ref={inputRef} />
      <Button {...buttonProps}>{isShown ? 'hide' : 'show'}</Button>
    </div>
  )
}

const Button: FC<any> = (props) => {
  const { children } = props
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, buttonRef)

  return (
    <button {...buttonProps} ref={buttonRef}>
      {children}
    </button>
  )
}

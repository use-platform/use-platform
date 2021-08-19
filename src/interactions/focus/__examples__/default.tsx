import { ButtonHTMLAttributes, FC, InputHTMLAttributes, useState } from 'react'
import { Story } from '@storybook/react'
import { useFocus, useFocusWithin } from '@yandex/web-platform'

const randomKey = Math.random().toString(36).substr(2, 5)

const classNames = {
  form: `box_${randomKey}`,
  input: `input_${randomKey}`,
  button: `button_${randomKey}`,
}

const styles = `
.${classNames.form} {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 12px;
  border: 2px solid #d9d9d9;
  border-radius: 12px;
  padding: 16px 12px;
  width: 300px;
  margin: 0 auto;
}

.${classNames.form}[data-focus-within='true'] {
  border-color: #0679ff;
}

.${classNames.input} {
  box-sizing: border-box;
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  padding: 7px 14px;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.${classNames.input}[data-focused='true'] {
  border-color: #b3b3b3;
}

.${classNames.button} {
  border: 0;
  padding: 8px 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #000;
  background-color: #d9d9d9;
  outline: none;
}

.${classNames.button}[data-focused='true'] {
  box-shadow: 0 0 0 2px #0679ff;
}
`

export const Default: Story = () => {
  const [isFocusWithin, onFocusWithinChange] = useState(false)
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange })

  return (
    <>
      <style>{styles}</style>
      <div
        {...focusWithinProps}
        className={classNames.form}
        tabIndex={-1}
        data-focus-within={isFocusWithin}
      >
        <Input type="text" placeholder="First Name" />
        <Input type="text" placeholder="Last Name" />
        <Button>Sign Up</Button>
      </div>
    </>
  )
}

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [isFocused, onFocusChange] = useState(false)
  const { focusProps } = useFocus({ ...props, onFocusChange })

  return <input className={classNames.input} {...props} {...focusProps} data-focused={isFocused} />
}

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const [isFocused, onFocusChange] = useState(false)
  const { focusProps } = useFocus({ ...props, onFocusChange })

  // TODO: use focus visible
  return (
    <button className={classNames.button} {...props} {...focusProps} data-focused={isFocused} />
  )
}

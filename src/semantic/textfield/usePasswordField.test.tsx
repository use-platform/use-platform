import { FC, useRef } from 'react'

import { createClientRender, screen, fireEvent, installPointerEvent } from '../../libs/testing'
import { useButton } from '../button'
import { usePasswordField } from './usePasswordField'

const PasswordField: FC<any> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isShown, buttonProps, inputProps } = usePasswordField(props, inputRef)
  const { buttonProps: toggleButtonProps } = useButton(buttonProps, { current: null })

  return (
    <>
      <input {...props} {...inputProps} ref={inputRef} data-testid="textfield" />
      <button {...toggleButtonProps} data-testid="button" data-shown={isShown} />
    </>
  )
}

describe('usePasswordField', () => {
  installPointerEvent()

  const render = createClientRender()

  test('should toggle input type after button click', () => {
    render(<PasswordField />)
    const textField = screen.getByTestId('textfield')
    expect(textField).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByTestId('button'))
    expect(textField).toHaveAttribute('type', 'text')
  })

  test('should toggle shown flag after button click', () => {
    render(<PasswordField />)
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('data-shown', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('data-shown', 'true')
  })

  test('should set negative tabIndex for button', () => {
    render(<PasswordField />)
    expect(screen.getByTestId('button')).toHaveAttribute('tabindex', '-1')
  })

  test('should set focus for input after clear-button click', () => {
    render(<PasswordField />)
    const textField = screen.getByTestId('textfield')
    expect(document.activeElement).toBe(document.body)
    textField.focus()
    fireEvent.click(screen.getByTestId('button'))
    expect(document.activeElement).toBe(textField)
  })

  test('should disable button with disabled props', () => {
    render(<PasswordField disabled />)
    expect(screen.getByTestId('button')).toHaveAttribute('disabled')
  })
})

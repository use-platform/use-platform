import { ChangeEvent, FC, useRef } from 'react'

import { createClientRender, fireEvent, installPointerEvent, screen } from '../../internal/testing'
import { useButton } from '../button'
import { useClearButton } from './useClearButton'

const TextField: FC<any> = (props) => {
  // Use mapping for onChange for easy testing.
  const onChange = (event: ChangeEvent) => props.onChange((event.target as HTMLInputElement).value)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isActive, buttonProps } = useClearButton({ ...props, onChange }, inputRef)
  const { buttonProps: clearButtonProps } = useButton(buttonProps, { current: null })

  return (
    <>
      <input {...props} ref={inputRef} data-testid="textfield" />
      <button {...clearButtonProps} data-testid="clear" data-active={isActive} />
    </>
  )
}

describe('useClearButton', () => {
  installPointerEvent()

  const render = createClientRender()

  test('should set active flag when value not empty', () => {
    const { setProps } = render(<TextField />)
    const clear = screen.getByTestId('clear')
    expect(clear).toHaveAttribute('data-active', 'false')
    setProps({ value: 'test' })
    expect(clear).toHaveAttribute('data-active', 'true')
  })

  test('should call onChange with empty value after clear-button click', async () => {
    const onChange = jest.fn()
    render(<TextField onChange={onChange} />)
    await fireEvent.click(screen.getByTestId('clear'))
    expect(onChange).toBeCalledWith('')
  })

  test('should set focus for input after clear-button click', () => {
    const onChange = jest.fn()
    render(<TextField value="test" onChange={onChange} />)
    const textField = screen.getByTestId('textfield')
    expect(document.activeElement).toBe(document.body)
    textField.focus()
    fireEvent.click(screen.getByTestId('clear'))
    expect(document.activeElement).toBe(textField)
  })

  test('should set negative tabIndex for clear-button', () => {
    render(<TextField />)
    expect(screen.getByTestId('clear')).toHaveAttribute('tabindex', '-1')
  })

  test('should disable clear-button with disabled props', () => {
    render(<TextField disabled />)
    expect(screen.getByTestId('clear')).toHaveAttribute('disabled')
  })

  test('should disable clear-button with readonly props', () => {
    render(<TextField disabled />)
    expect(screen.getByTestId('clear')).toHaveAttribute('disabled')
  })
})

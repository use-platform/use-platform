import { FC, ChangeEvent, useRef } from 'react'

import { createClientRender, screen, fireEvent } from '../../libs/testing'
import { useTextField } from './useTextField'

const TextField: FC<any> = (props) => {
  // Use mapping for onChange for easy testing.
  const onChange = (event: ChangeEvent) => props.onChange((event.target as HTMLInputElement).value)
  const inputRef = useRef<HTMLInputElement>(null)
  const { ElementType, inputProps } = useTextField({ ...props, onChange }, inputRef)

  return <ElementType {...inputProps} ref={inputRef} data-testid="textfield" />
}

describe('useTextField', () => {
  const render = createClientRender()

  test('should render as input element', () => {
    render(<TextField />)
    const textField = screen.getByTestId('textfield')
    expect(textField instanceof HTMLInputElement).toBeTruthy()
    expect(textField).toHaveAttribute('type', 'text')
  })

  test('should render as textarea element', () => {
    render(<TextField as="textarea" />)
    const textField = screen.getByTestId('textfield')
    expect(textField instanceof HTMLTextAreaElement).toBeTruthy()
    expect(textField).not.toHaveAttribute('type')
  })

  test('should trigger onChange after type', () => {
    const onChange = jest.fn()
    render(<TextField onChange={onChange} />)
    fireEvent.type(screen.getByTestId('textfield'), 'test')
    expect(onChange).toBeCalledWith('test')
  })
})

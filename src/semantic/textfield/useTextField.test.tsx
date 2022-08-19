import { ChangeEvent, FC, useRef } from 'react'

import { createClientRender, screen } from '../../internal/testing'
import { TextFieldProps, useTextField } from './useTextField'

const TextField: FC<TextFieldProps> = (props) => {
  const { elementType: ElementType = 'input' } = props
  // Use mapping for onChange for easy testing.
  const onChange = (event: ChangeEvent) =>
    props.onChange?.((event.target as HTMLInputElement).value as any)
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps } = useTextField({ ...props, onChange }, inputRef)

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
    render(<TextField elementType="textarea" />)
    const textField = screen.getByTestId('textfield')
    expect(textField instanceof HTMLTextAreaElement).toBeTruthy()
    expect(textField).not.toHaveAttribute('type')
  })
})

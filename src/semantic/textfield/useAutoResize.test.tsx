import { FC, useCallback, useRef, useState } from 'react'

import { createClientRender, screen } from '../../internal/testing'
import type { TextFieldBaseProps } from './types'
import { useAutoResize } from './useAutoResize'
import { useTextField } from './useTextField'

interface TextFieldProps extends TextFieldBaseProps {
  autoResize?: boolean
  minRows?: number
  maxRows?: number
}

const TextField: FC<TextFieldProps> = (props) => {
  const [value, setValue] = useState('Text')
  const onChange = useCallback((event: any) => {
    setValue(event.target.value)
  }, [])

  const { autoResize = false, minRows, maxRows, ...restProps } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { inputProps } = useTextField({ ...restProps, elementType: 'textarea' }, inputRef)
  useAutoResize({ enabled: autoResize, minRows: minRows, maxRows: maxRows, value: value }, inputRef)

  return (
    <textarea
      {...inputProps}
      value={value}
      onChange={onChange}
      ref={inputRef}
      data-testid="textfield"
    />
  )
}

// Actually we can't test autoresize because "jestdom"
// not render real elements and we can't get scrollHeight.
describe('useAutoResize', () => {
  const render = createClientRender()

  test('Disabled auto resize', () => {
    render(<TextField />)
    const node = screen.getByTestId('textfield')
    expect(node.getAttribute('rows')).toEqual('1')
  })

  test('Enable auto resize', () => {
    render(<TextField autoResize />)
    const node = screen.getByTestId('textfield')
    expect(node).toHaveAttribute('rows')
  })

  test('MinRows auto resize', () => {
    render(<TextField autoResize minRows={10} />)
    const node = screen.getByTestId('textfield')
    expect(node.getAttribute('rows')).toEqual('10')
  })
})

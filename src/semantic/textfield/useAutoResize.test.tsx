import { FC, useRef } from 'react'

import { createClientRender, screen } from '../../libs/testing'
import type { TextFieldBaseProps } from './types'
import { useAutoResize } from './useAutoResize'
import { useTextField } from './useTextField'

interface TextFieldProps extends TextFieldBaseProps {
  autoResize?: boolean
}

const TextField: FC<TextFieldProps> = (props) => {
  const { autoResize = false, ...restProps } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { inputProps } = useTextField({ ...restProps, as: 'textarea' }, inputRef)
  useAutoResize({ enabled: autoResize }, inputRef)

  return <textarea {...inputProps} ref={inputRef} data-testid="textfield" />
}

// Actually we can't test autoresize because "jestdom"
// not render real elements and we can't get scrollHeight.
describe('useAutoResize', () => {
  const render = createClientRender()

  test('should not set style with disbled auto resize', () => {
    render(<TextField />)
    const node = screen.getByTestId('textfield')
    expect(node).not.toHaveAttribute('style')
  })

  test('should set style with enabled auto resize', () => {
    render(<TextField autoResize />)
    const node = screen.getByTestId('textfield')
    expect(node).toHaveAttribute('style', 'height: 0px;')
  })
})

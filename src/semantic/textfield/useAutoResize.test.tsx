import { FC, useRef } from 'react'

import { createClientRender, screen } from '../../libs/testing'
import { useAutoResize } from './useAutoResize'
import { useTextField } from './useTextField'
// TODO: fix any type
const TextField: FC<any> = (props) => {
  const { autoResize, ...restProps } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { ElementType, inputProps } = useTextField(restProps, inputRef)
  useAutoResize({ enabled: autoResize, ...restProps }, inputRef)

  return <ElementType {...inputProps} ref={inputRef} data-testid="textfield" />
}

// Actually we can't test autoresize because "jestdom"
// not render real elements and we can't get scrollHeight.
describe('useAutoResize', () => {
  const render = createClientRender()

  test('should not set style with disbled auto resize', () => {
    render(<TextField as="textarea" />)
    const node = screen.getByTestId('textfield')
    expect(node).not.toHaveAttribute('style')
  })

  test('should set style with enabled auto resize', () => {
    render(<TextField as="textarea" autoResize />)
    const node = screen.getByTestId('textfield')
    expect(node).toHaveAttribute('style', 'height: 0px;')
  })
})

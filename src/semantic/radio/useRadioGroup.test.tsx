import { FC } from 'react'

import { createClientRender, fireEvent, screen } from '../../internal/testing'
import { useRadioGroup } from './useRadioGroup'

const RadioGroup: FC<any> = (props) => {
  const { rootProps } = useRadioGroup(props)

  return (
    <div {...rootProps} data-testid="radio-group">
      <input type="radio" value="foo" data-testid="radio" />
    </div>
  )
}

describe('useRadioGroup', () => {
  const render = createClientRender()

  test('should have radiogroup role', () => {
    render(<RadioGroup />)
    expect(screen.getByTestId('radio-group')).toHaveAttribute('role', 'radiogroup')
  })

  test('should not listen for propagated event', () => {
    const handler = jest.fn(() => {})
    render(<RadioGroup onChange={handler} />)
    fireEvent.click(screen.getByTestId('radio'))
    expect(handler).not.toBeCalled()
  })

  test('should set aria-disabled attribute', () => {
    render(<RadioGroup disabled />)
    expect(screen.getByTestId('radio-group')).toHaveAttribute('aria-disabled')
  })

  test('should set aria-readonly attribute', () => {
    render(<RadioGroup readOnly />)
    expect(screen.getByTestId('radio-group')).toHaveAttribute('aria-readonly')
  })
})

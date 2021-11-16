import { FC } from 'react'
import { useRadioGroup } from './useRadioGroup'
import { createClientRender, fireEvent, screen } from '../../libs/testing'

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

  test('onChange event from radio should propagate', () => {
    const handler = jest.fn(() => {})
    render(<RadioGroup onChange={handler} />)
    fireEvent.click(screen.getByTestId('radio'))
    expect(handler).toBeCalled()
  })
})

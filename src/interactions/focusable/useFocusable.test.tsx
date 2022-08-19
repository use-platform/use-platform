import { FC, useRef } from 'react'

import { createClientRender, screen } from '../../internal/testing'
import { UseFocusableProps, useFocusable } from './useFocusable'

const Fixture: FC<UseFocusableProps> = (props) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { focusableProps } = useFocusable(props, ref)

  return <button {...focusableProps} ref={ref} data-testid="focusable" />
}

describe('useFocusable', () => {
  const render = createClientRender()

  test('should render component with auto focus', () => {
    render(<Fixture autoFocus />)
    const node = screen.getByTestId('focusable')
    expect(node).toHaveFocus()
  })

  test('should render disabled component with negative tabIndex', () => {
    render(<Fixture disabled />)
    const node = screen.getByTestId('focusable')
    expect(node).toHaveAttribute('tabIndex', '-1')
  })

  test('should render component with custom tabIndex', () => {
    render(<Fixture tabIndex={1} />)
    const node = screen.getByTestId('focusable')
    expect(node).toHaveAttribute('tabIndex', '1')
  })
})

import { createElement, FC, useRef } from 'react'

import { createClientRender, screen } from '../../libs/testing'
import { useFocusable } from './useFocusable'

const Fixture: FC<{ disabled?: boolean; autoFocus?: boolean }> = (props) => {
  const { disabled, autoFocus } = props
  const ref = useRef<HTMLButtonElement>(null)
  const { focusableProps } = useFocusable({ disabled, autoFocus }, ref)

  return createElement('button', {
    ...focusableProps,
    ref,
    ['data-testid']: 'focusable',
  })
}

describe('useFocusable', () => {
  const render = createClientRender()

  test('should render component with auto focus', () => {
    render(createElement(Fixture, { autoFocus: true }))

    const node = screen.getByTestId('focusable')

    expect(node).toHaveFocus()
  })

  test('should render disabled component with negative tabIndex', () => {
    render(createElement(Fixture, { disabled: true }))

    const node = screen.getByTestId('focusable')

    expect(node).toHaveAttribute('tabIndex', '-1')
  })
})

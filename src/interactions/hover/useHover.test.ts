import { FC, createElement } from 'react'

import { createClientRender, fireEvent, installPointerEvent, screen } from '../../libs/testing'
import { useHover } from './useHover'

const Fixture: FC<{ disabled: true }> = (props) => {
  const { disabled } = props
  const { isHovered, hoverProps } = useHover({ disabled })

  return createElement('div', {
    ...hoverProps,
    ['data-testid']: 'hoverable',
    ['data-hovered']: isHovered,
  })
}

describe('useHover', () => {
  const render = createClientRender()

  describe('pointer events', () => {
    installPointerEvent()

    test('should set isHovered after pointer enter and leave', () => {
      render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      expect(node).toHaveAttribute('data-hovered', 'false')
      fireEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'true')
      fireEvent.unhover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })

    test('should not set isHovered when disabled', () => {
      const { setProps } = render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      setProps({ disabled: true })

      fireEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })
  })
})

import { FC, createElement } from 'react'

import { createClientRender, fireEvent, installPointerEvent, screen } from '../../internal/testing'
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

    test('should set isHovered after pointer enter and leave', async () => {
      render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      expect(node).toHaveAttribute('data-hovered', 'false')
      await fireEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'true')
      await fireEvent.unhover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })

    test('should not set isHovered when disabled', () => {
      const { setProps } = render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      setProps({ disabled: true })

      fireEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })

    test('should not set isHovered when on touch device', () => {
      render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      expect(node).toHaveAttribute('data-hovered', 'false')
      fireEvent.touchStart(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
      fireEvent.touchEnd(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })
  })
})

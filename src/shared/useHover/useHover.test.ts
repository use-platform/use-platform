import { createElement, FC } from 'react'

import { createClientRender, screen, userEvent, installPointerEvent } from '../../libs/testing'
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

  describe('mouse events', () => {
    test('should set isHovered after mouse enter and leave', () => {
      render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      expect(node).toHaveAttribute('data-hovered', 'false')
      userEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'true')
      userEvent.unhover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })

    test('should not set isHovered when disabled', () => {
      const { setProps } = render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      setProps({ disabled: true })

      userEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })
  })

  describe('pointer events', () => {
    installPointerEvent()

    test('should set isHovered after pointer enter and leave', () => {
      render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      expect(node).toHaveAttribute('data-hovered', 'false')
      userEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'true')
      userEvent.unhover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })

    test('should not set isHovered when disabled', () => {
      const { setProps } = render(createElement(Fixture))

      const node = screen.getByTestId('hoverable')

      setProps({ disabled: true })

      userEvent.hover(node)
      expect(node).toHaveAttribute('data-hovered', 'false')
    })
  })
})

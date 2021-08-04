import { createClientRender, screen } from '../../testing'
import { ElementTreeWalker } from '../ElementTreeWalker'

describe('ElementTreeWalker', () => {
  const render = createClientRender()

  test('should returns null if previous node is root', () => {
    render(
      <div data-testid="root">
        <div />
        <div />
      </div>,
    )

    const walker = new ElementTreeWalker(
      screen.getByTestId('root'),
      (node) => node.tagName === 'DIV',
    )

    walker.next()
    expect(walker.previous()).toBe(null)
  })

  test('should returns null of current after set root node', () => {
    render(
      <div data-testid="root">
        <div />
        <div />
      </div>,
    )

    const walker = new ElementTreeWalker(
      screen.getByTestId('root'),
      (node) => node.tagName === 'DIV',
    )

    walker.current = walker.root
    expect(walker.current).toBe(null)
  })

  test('should returns last element', () => {
    render(
      <div data-testid="root">
        <div>
          <div />
          <div data-testid="last" />
        </div>
      </div>,
    )

    const walker = new ElementTreeWalker(
      screen.getByTestId('root'),
      (node) => node.tagName === 'DIV',
    )

    expect(walker.last()).toBe(screen.getByTestId('last'))
  })
})

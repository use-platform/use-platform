import { createClientRender, screen } from '../../libs/testing'
import { VisuallyHidden } from './VisuallyHidden'

const hiddenText = 'Hidden text'

describe('VisuallyHidden', () => {
  const render = createClientRender()

  test('should match snapshot', () => {
    render(
      <button data-testid="test">
        <VisuallyHidden>{hiddenText}</VisuallyHidden>
      </button>,
    )
    expect(screen.getByTestId('test')).toMatchSnapshot()
  })
})

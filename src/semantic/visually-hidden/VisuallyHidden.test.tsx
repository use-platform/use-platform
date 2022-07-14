import { createClientRender, screen } from '../../libs/testing'
import { VisuallyHidden } from './VisuallyHidden'

const hiddenText = 'Hidden text'

describe('useFocusTrap', () => {
  const render = createClientRender()

  test('should render element with proper styles', () => {
    render(<VisuallyHidden>{hiddenText}</VisuallyHidden>)
    expect(screen.getByText('Hidden text')).toHaveStyle({
      border: 0,
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '0 -1px -1px 0',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      whiteSpace: 'nowrap',
    })
  })

  test('should match snapshot', () => {
    render(
      <button data-testid="test">
        <VisuallyHidden>{hiddenText}</VisuallyHidden>
      </button>,
    )
    expect(screen.getByTestId('test')).toMatchSnapshot()
  })
})

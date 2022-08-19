import { screen } from '../../internal/testing'
import { announce, disposeLiveAnnouncer } from './LiveAnnouncer'

describe('LiveAnnouncer', () => {
  afterEach(() => {
    disposeLiveAnnouncer()
  })

  test('should have aria attributes', () => {
    const message = 'announced text'

    announce(message)

    const element = screen.getByText(message)
    expect(element).toHaveAttribute('aria-live')
    expect(element).toHaveAttribute('aria-atomic', 'true')
  })

  test('should announce last message', () => {
    const message1 = 'announced text 1'
    const message2 = 'announced text 2'
    announce(message1)
    announce(message2)

    expect(screen.queryByText(message1)).not.toBeInTheDocument()
    expect(screen.getByText(message2)).toBeInTheDocument()
  })

  test('should announce twice same message', () => {
    const message = 'announced text'

    announce(message)
    expect(screen.getByText(message).textContent).toBe(message)

    announce(message)
    expect(screen.getByText(message).textContent).toBe(message + '\xa0')
  })

  test('should announce with polite priority by default', () => {
    const message = 'announced text'

    announce(message)
    expect(screen.getByText(message)).toHaveAttribute('aria-live', 'polite')
  })

  test('should announce with assertive priority', () => {
    const message = 'announced text'

    announce(message, 'assertive')
    expect(screen.getByText(message)).toHaveAttribute('aria-live', 'assertive')
  })

  test('should dispose announcer', () => {
    const message = 'announced text'

    announce(message, 'assertive')
    disposeLiveAnnouncer()

    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })
})

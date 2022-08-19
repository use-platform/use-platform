import { createClientRender, screen } from '../../../internal/testing'
import { FocusNavigation } from '../FocusNavigation'

describe('FocusNavigation', () => {
  const render = createClientRender()

  test('should returns correct scope element', () => {
    const scope = document.createElement('div')
    const navigation = new FocusNavigation(scope)

    expect(navigation.scope).toBe(scope)
  })

  test('should returns null of current after initialize', () => {
    const scope = document.createElement('div')
    const navigation = new FocusNavigation(scope)

    expect(navigation.current).toBe(null)
  })

  test('should returns next tabbable from element with tabIndex = -1', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-2" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused1 = navigation.next({ tabbable: true, from: screen.getByTestId('focusable-1') })
    expect(focused1).toBe(screen.getByTestId('tabbable-2'))

    const focused2 = navigation.next({ tabbable: true, from: screen.getByTestId('focusable-2') })
    expect(focused2).toBe(screen.getByTestId('tabbable-1'))
  })

  test('should returns next tabbable element with greater tabIndex 0', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={1} data-testid="tabbable-3" />
        <input tabIndex={2} data-testid="tabbable-4" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.next({ tabbable: true })

    expect(focused).toBe(screen.getByTestId('tabbable-2'))
  })

  test('should returns next tabbable element with same tabIndex', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={2} data-testid="tabbable-3" />
        <input tabIndex={1} data-testid="tabbable-4" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)
    const from = screen.getByTestId('tabbable-2')
    const focused = navigation.next({ tabbable: true, from })

    expect(focused).toBe(screen.getByTestId('tabbable-4'))
  })

  test('should returns null of next from last element with tabIndex = 0', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={2} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)
    const from = screen.getByTestId('tabbable-1')
    const focused = navigation.next({ tabbable: true, from })

    expect(focused).toBe(null)
  })

  test('should returns null of next from last tabbable element', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={1} data-testid="tabbable-1" />
        <input tabIndex={2} data-testid="tabbable-2" />
        <input tabIndex={3} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)
    const from = screen.getByTestId('tabbable-3')
    const focused = navigation.next({ tabbable: true, from })

    expect(focused).toBe(null)
  })

  test('should returns next element with tabIndex 0 from element with max tabIndex', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={1} data-testid="tabbable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={2} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)
    const from = screen.getByTestId('tabbable-3')
    const focused = navigation.next({ tabbable: true, from })

    expect(focused).toBe(screen.getByTestId('tabbable-2'))
  })

  test('should returns next focusable element of normal dom order', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-2" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused1 = navigation.next()
    expect(focused1).toBe(screen.getByTestId('focusable-1'))

    const focused2 = navigation.next({ from: screen.getByTestId('tabbable-2') })
    expect(focused2).toBe(screen.getByTestId('focusable-2'))
  })

  test('should returns previous tabbable from element with tabIndex = -1', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={-1} data-testid="focusable-2" />
        <input tabIndex={2} data-testid="tabbable-2" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused1 = navigation.previous({
      tabbable: true,
      from: screen.getByTestId('focusable-1'),
    })
    expect(focused1).toBe(screen.getByTestId('tabbable-2'))

    const focused2 = navigation.previous({
      tabbable: true,
      from: screen.getByTestId('focusable-2'),
    })
    expect(focused2).toBe(screen.getByTestId('tabbable-1'))
  })

  test('should returns previous tabbable element from end', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={1} data-testid="tabbable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={2} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.previous({ tabbable: true })
    expect(focused).toBe(screen.getByTestId('tabbable-2'))
  })

  test('should returns previous tabbable element with same tabIndex', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={1} data-testid="tabbable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={1} data-testid="tabbable-3" />
        <input tabIndex={2} data-testid="tabbable-4" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.previous({ tabbable: true, from: screen.getByTestId('tabbable-3') })
    expect(focused).toBe(screen.getByTestId('tabbable-1'))
  })

  test('should returns previous tabbable element with lower tabIndex', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={2} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.previous({ tabbable: true, from: screen.getByTestId('tabbable-3') })
    expect(focused).toBe(screen.getByTestId('tabbable-2'))
  })

  test('should returns previous focusable element of normal dom order', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-1" />
        <input tabIndex={1} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-2" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused1 = navigation.previous()
    expect(focused1).toBe(screen.getByTestId('focusable-2'))

    const focused2 = navigation.previous({ from: screen.getByTestId('tabbable-1') })
    expect(focused2).toBe(screen.getByTestId('focusable-1'))
  })

  test('should returns first tabbable element from last with wrap option', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={1} data-testid="tabbable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={2} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.next({
      from: screen.getByTestId('tabbable-2'),
      tabbable: true,
      wrap: true,
    })
    expect(focused).toBe(screen.getByTestId('tabbable-1'))
  })

  test('should returns last tabbable element from first with wrap option', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={1} data-testid="tabbable-1" />
        <input tabIndex={2} data-testid="tabbable-2" />
        <input tabIndex={0} data-testid="tabbable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.previous({
      from: screen.getByTestId('tabbable-1'),
      tabbable: true,
      wrap: true,
    })
    expect(focused).toBe(screen.getByTestId('tabbable-3'))
  })

  test('should returns first focusable element from last with wrap option', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.next({
      from: screen.getByTestId('focusable-3'),
      wrap: true,
    })
    expect(focused).toBe(screen.getByTestId('focusable-1'))
  })

  test('should returns last focusable element from first with wrap option', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.previous({
      from: screen.getByTestId('focusable-1'),
      wrap: true,
    })
    expect(focused).toBe(screen.getByTestId('focusable-3'))
  })

  test('should returns first focusable element', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.first()
    expect(focused).toBe(screen.getByTestId('focusable-1'))
  })

  test('should returns first tabbable element', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={0} data-testid="tabbable-3" />
        <input tabIndex={-1} data-testid="focusable-4" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.first(true)
    expect(focused).toBe(screen.getByTestId('tabbable-2'))
  })

  test('should returns last focusable element', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={-1} data-testid="focusable-3" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.last()
    expect(focused).toBe(screen.getByTestId('focusable-3'))
  })

  test('should returns last tabbable element', () => {
    render(
      <div data-testid="scope">
        <input tabIndex={-1} data-testid="focusable-1" />
        <input tabIndex={0} data-testid="tabbable-2" />
        <input tabIndex={0} data-testid="tabbable-3" />
        <input tabIndex={-1} data-testid="focusable-4" />
      </div>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.last(true)
    expect(focused).toBe(screen.getByTestId('tabbable-3'))
  })

  test('should returns first tabbable element from outside element of scope', () => {
    render(
      <>
        <div data-testid="scope">
          <input tabIndex={-1} data-testid="focusable-1" />
          <input tabIndex={0} data-testid="tabbable-2" />
          <input tabIndex={0} data-testid="tabbable-3" />
          <input tabIndex={-1} data-testid="focusable-4" />
        </div>
        <div>
          <input data-testid="outside" />
        </div>
      </>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.next({ from: screen.getByTestId('outside'), tabbable: true })
    expect(focused).toBe(screen.getByTestId('tabbable-2'))
  })

  test('should returns last tabbable element from outside element of scope', () => {
    render(
      <>
        <div>
          <input data-testid="outside" />
        </div>
        <div data-testid="scope">
          <input tabIndex={-1} data-testid="focusable-1" />
          <input tabIndex={0} data-testid="tabbable-2" />
          <input tabIndex={0} data-testid="tabbable-3" />
          <input tabIndex={-1} data-testid="focusable-4" />
        </div>
      </>,
    )

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    const focused = navigation.previous({ from: screen.getByTestId('outside'), tabbable: true })
    expect(focused).toBe(screen.getByTestId('tabbable-3'))
  })

  test('complex returns all focusable and tabbable elements', () => {
    render(
      <div data-testid="scope">
        <div contentEditable data-testid="content-editable-true" />
        <div contentEditable={false} data-testid="content-editable-false" />
        <span tabIndex={0} data-testid="span-tab-index-0" />
        <span tabIndex={1} data-testid="span-tab-index-1" />
        <a href="#" data-testid="a-with-href">
          link
        </a>
        <audio controls data-testid="audio-with-controls" />
        <video controls data-testid="video-with-controls" />
        <button data-testid="button">button</button>
        <button data-testid="button-disabled" disabled>
          button
        </button>
        <select data-testid="select">
          <option>option</option>
        </select>
        <textarea data-testid="textarea" defaultValue="text" />
        <iframe data-testid="iframe" />
        <form>
          <input type="radio" name="radio-1" data-testid="radio-1" value="1" />
          <input type="radio" name="radio-1" data-testid="radio-2" value="2" defaultChecked />
          <input type="radio" name="radio-1" data-testid="radio-3" value="3" />
        </form>
      </div>,
    )

    // https://github.com/jsdom/jsdom/issues/1670
    const divContentEditableTrue = screen.getByTestId('content-editable-true')
    divContentEditableTrue.contentEditable = 'true'

    const scope = screen.getByTestId('scope')
    const navigation = new FocusNavigation(scope)

    function collect(tabbable: boolean) {
      const items: string[] = []
      navigation.next({ tabbable, wrap: false, from: null })

      for (; navigation.current; navigation.next({ tabbable, wrap: false })) {
        const testId = navigation.current.dataset.testid
        if (testId) {
          items.push(testId)
        }
      }

      return items
    }

    const focusables = collect(false)
    expect(focusables).toEqual([
      'content-editable-true',
      'span-tab-index-0',
      'span-tab-index-1',
      'a-with-href',
      'audio-with-controls',
      'video-with-controls',
      'button',
      'select',
      'textarea',
      'iframe',
      'radio-1',
      'radio-2',
      'radio-3',
    ])

    const tabbables = collect(true)
    expect(tabbables).toEqual([
      'span-tab-index-1',
      'content-editable-true',
      'span-tab-index-0',
      'a-with-href',
      'audio-with-controls',
      'video-with-controls',
      'button',
      'select',
      'textarea',
      'radio-2',
    ])
  })
})

import { renderHook } from '../../../internal/testing'
import { UseRestoreFocusProps, useRestoreFocus } from '../useRestoreFocus'

let elements: HTMLElement[] = []

function createFocusableElement(testId: string) {
  const element = document.createElement('button')
  element.dataset.testId = testId

  document.body.appendChild(element)
  elements.push(element)

  return element
}

describe('useRestoreFocus', () => {
  afterEach(() => {
    elements.forEach((el) => {
      document.body.removeChild(el)
    })
    elements = []
  })

  test('should return focus in last active element', () => {
    const a = createFocusableElement('a')
    const b = createFocusableElement('b')
    a.focus()

    const { rerender } = renderHook<void, UseRestoreFocusProps>((props) => useRestoreFocus(props), {
      initialProps: { enabled: true },
    })

    b.focus()
    rerender({ enabled: false })

    expect(a).toHaveFocus()
  })

  test('should return focus in custom element', () => {
    const a = createFocusableElement('a')
    const b = createFocusableElement('b')
    const restoreFocusRef = { current: b }
    a.focus()

    const { rerender } = renderHook<void, UseRestoreFocusProps>((props) => useRestoreFocus(props), {
      initialProps: { enabled: true, restoreFocusRef },
    })

    expect(a).toHaveFocus()

    rerender({ enabled: false })

    expect(b).toHaveFocus()
  })
})

import { PropsWithChildren, createRef, forwardRef, useImperativeHandle, useRef } from 'react'

import { createClientRender, renderHook, screen } from '../../../internal/testing'
import { FocusManagerScope, FocusManagerScopeProps, useFocusManager } from '../FocusManagerScope'
import { FocusManager } from '../createFocusManager'

const UseFocusManager = forwardRef<FocusManager, {}>((_props, ref) => {
  const manager = useFocusManager()

  useImperativeHandle(ref, () => manager, [manager])

  return null
})

const Fixture = forwardRef<FocusManager, PropsWithChildren<{ autoFocus?: boolean }>>(
  (props, ref) => {
    const { children, autoFocus } = props
    const scopeRef = useRef<HTMLDivElement>(null)

    return (
      <FocusManagerScope scopeRef={scopeRef} autoFocus={autoFocus}>
        <UseFocusManager ref={ref} />
        <div ref={scopeRef} data-testid="scope">
          {children}
        </div>
      </FocusManagerScope>
    )
  },
)

describe('FocusManagerScope', () => {
  const render = createClientRender()

  test('should throw an error if there is no <FocusManagerScope />', () => {
    let { result } = renderHook(() => useFocusManager())

    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toMatch(/Could not find focus manager context value/)
  })

  test('should provide a safe method call of focus manager', () => {
    const scopeRef = createRef<HTMLElement>()
    const { result } = renderHook<FocusManagerScopeProps, FocusManager>(() => useFocusManager(), {
      initialProps: { scopeRef },
      wrapper: ({ children }) => (
        <FocusManagerScope scopeRef={scopeRef}>{children}</FocusManagerScope>
      ),
    })

    expect(result.current.focusFirst()).toBe(null)
    expect(result.current.focusLast()).toBe(null)
    expect(result.current.focusNext()).toBe(null)
    expect(result.current.focusPrevious()).toBe(null)
  })

  test('should move focus to first tabbable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input />
        <input tabIndex={1} data-testid="item" />
        <input />
      </Fixture>,
    )

    ref.current?.focusNext({ from: null, tabbable: true })

    expect(screen.getByTestId('item')).toHaveFocus()
  })

  test('should move focus to first focusable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input data-testid="item" />
        <input tabIndex={1} />
        <input />
      </Fixture>,
    )

    ref.current?.focusNext({ from: null })

    expect(screen.getByTestId('item')).toHaveFocus()
  })

  test('should move focus to last tabbable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input />
        <input tabIndex={1} />
        <input data-testid="item" />
      </Fixture>,
    )

    ref.current?.focusPrevious({ from: null, tabbable: true })

    expect(screen.getByTestId('item')).toHaveFocus()
  })

  test('should move focus to last focusable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input />
        <input tabIndex={1} />
        <input data-testid="item" />
      </Fixture>,
    )

    ref.current?.focusPrevious({ from: null })

    expect(screen.getByTestId('item')).toHaveFocus()
  })

  test('should move focus to next focusable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input tabIndex={-1} data-testid="item-1" />
        <input tabIndex={0} data-testid="item-2" />
        <input tabIndex={1} data-testid="item-3" />
      </Fixture>,
    )

    ref.current?.focusNext()
    expect(screen.getByTestId('item-1')).toHaveFocus()

    ref.current?.focusNext()
    expect(screen.getByTestId('item-2')).toHaveFocus()

    ref.current?.focusNext()
    expect(screen.getByTestId('item-3')).toHaveFocus()

    const focused = ref.current?.focusNext()
    expect(focused).toBe(null)
    expect(screen.getByTestId('item-3')).toHaveFocus()
  })

  test('should move focus to next tabbable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input tabIndex={-1} data-testid="item-1" />
        <input tabIndex={0} data-testid="item-2" />
        <input tabIndex={1} data-testid="item-3" />
      </Fixture>,
    )

    ref.current?.focusNext({ tabbable: true })
    expect(screen.getByTestId('item-3')).toHaveFocus()

    ref.current?.focusNext({ tabbable: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()

    const focused = ref.current?.focusNext({ tabbable: true })
    expect(focused).toBe(null)
    expect(screen.getByTestId('item-2')).toHaveFocus()
  })

  test('should move focus to previous focusable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input tabIndex={0} data-testid="item-1" />
        <input tabIndex={1} data-testid="item-2" />
        <input tabIndex={-1} data-testid="item-3" />
      </Fixture>,
    )

    ref.current?.focusPrevious()
    expect(screen.getByTestId('item-3')).toHaveFocus()

    ref.current?.focusPrevious()
    expect(screen.getByTestId('item-2')).toHaveFocus()

    ref.current?.focusPrevious()
    expect(screen.getByTestId('item-1')).toHaveFocus()

    const focused = ref.current?.focusPrevious()
    expect(focused).toBe(null)
    expect(screen.getByTestId('item-1')).toHaveFocus()
  })

  test('should move focus to previous tabbable element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input tabIndex={0} data-testid="item-1" />
        <input tabIndex={1} data-testid="item-2" />
        <input tabIndex={-1} data-testid="item-3" />
      </Fixture>,
    )

    ref.current?.focusPrevious({ tabbable: true })
    expect(screen.getByTestId('item-1')).toHaveFocus()

    ref.current?.focusPrevious({ tabbable: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()

    const focused = ref.current?.focusPrevious({ tabbable: true })
    expect(focused).toBe(null)
    expect(screen.getByTestId('item-2')).toHaveFocus()
  })

  test('should move focus forward and wrap around', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input data-testid="item-1" />
        <input data-testid="item-2" />
      </Fixture>,
    )

    ref.current?.focusNext({ tabbable: true, wrap: true })
    expect(screen.getByTestId('item-1')).toHaveFocus()

    ref.current?.focusNext({ tabbable: true, wrap: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()

    ref.current?.focusNext({ tabbable: true, wrap: true })
    expect(screen.getByTestId('item-1')).toHaveFocus()
  })

  test('should move focus backward and wrap around', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input data-testid="item-1" />
        <input data-testid="item-2" />
      </Fixture>,
    )

    ref.current?.focusPrevious({ tabbable: true, wrap: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()

    ref.current?.focusPrevious({ tabbable: true, wrap: true })
    expect(screen.getByTestId('item-1')).toHaveFocus()

    ref.current?.focusPrevious({ tabbable: true, wrap: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()
  })

  test('should move focus to first element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input tabIndex={-1} data-testid="item-1" />
        <input data-testid="item-2" />
        <input data-testid="item-3" />
      </Fixture>,
    )

    ref.current?.focusFirst()
    expect(screen.getByTestId('item-1')).toHaveFocus()

    ref.current?.focusFirst({ tabbable: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()
  })

  test('should move focus to last element', () => {
    const ref = createRef<FocusManager>()

    render(
      <Fixture ref={ref}>
        <input data-testid="item-1" />
        <input data-testid="item-2" />
        <input tabIndex={-1} data-testid="item-3" />
      </Fixture>,
    )

    ref.current?.focusLast()
    expect(screen.getByTestId('item-3')).toHaveFocus()

    ref.current?.focusLast({ tabbable: true })
    expect(screen.getByTestId('item-2')).toHaveFocus()
  })

  test('should focus first element with autoFocus', () => {
    render(
      <Fixture autoFocus>
        <input data-testid="item-1" />
      </Fixture>,
    )

    expect(screen.getByTestId('item-1')).toHaveFocus()
  })
})

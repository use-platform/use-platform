import { FC } from 'react'
import { useVirtual } from 'react-virtual'

import { createClientRender, screen } from '../../internal/testing'
import { RenderElementProps, UseVirtualizedProps } from './types'
import { useVirtualized } from './useVirtualized'

jest.mock('react-virtual')

interface FixtureItem {
  text?: string
}

const Fixture: FC<Partial<UseVirtualizedProps<FixtureItem>>> = ({
  items,
  estimate,
  renderElement,
  focusedIndex = null,
}) => {
  const {
    containerProps,
    innerProps,
    virtualItems: children,
  } = useVirtualized({
    items: items ?? [],
    estimate: estimate ?? 52,
    renderElement: renderElement ?? ((_) => <></>),
    focusedIndex: focusedIndex,
  })

  return (
    <div {...containerProps} data-testid="container">
      <ul {...innerProps} data-testid="inner">
        {children}
      </ul>
    </div>
  )
}

const scrollToIndexSpy = jest.fn<
  void,
  [number, { align: 'start' | 'end' | 'center' | 'auto' } | undefined]
>()

function establishMocks() {
  (useVirtual as jest.MockedFunction<typeof useVirtual>).mockReturnValue({
    virtualItems: [],
    totalSize: 0,
    scrollToOffset: jest.fn(),
    scrollToIndex: scrollToIndexSpy,
    measure: jest.fn(),
  })
}

describe('useVirtualized', () => {
  beforeAll(() => {
    establishMocks()
  })

  afterEach(() => {
    (useVirtual as jest.MockedFunction<typeof useVirtual>).mockReset()
    scrollToIndexSpy.mockClear()
    establishMocks()
  })

  const render = createClientRender()

  test('should apply overflowY to container', () => {
    render(<Fixture />)
    expect(screen.getByTestId('container').style.overflowY).toBe('auto')
  })

  test('should set inner position', () => {
    render(<Fixture />)
    expect(screen.getByTestId('inner').style.position).toBe('relative')
  })

  test('should set inner height', () => {
    (useVirtual as jest.MockedFunction<typeof useVirtual>).mockReset()
    ;(useVirtual as jest.MockedFunction<typeof useVirtual>).mockReturnValueOnce({
      totalSize: 420,
      scrollToIndex: jest.fn(),
      scrollToOffset: jest.fn(),
      measure: jest.fn(),
      virtualItems: [],
    })
    render(<Fixture />)
    expect(screen.getByTestId('inner').style.height).toBe('420px')
  })

  test('should call useVirtual', () => {
    render(<Fixture />)
    expect(useVirtual).toHaveBeenCalled()
  })

  test('should call useVirtual with valid ref', () => {
    render(<Fixture />)
    const useVirtualCalls = (useVirtual as jest.MockedFunction<typeof useVirtual>).mock.calls
    const firstCallArgs = useVirtualCalls[0]
    const firstCallOptions = firstCallArgs[0]
    expect(firstCallOptions.parentRef?.current).toBe(screen.getByTestId('container'))
  })

  test('should call use virtual with valid size', () => {
    const items: FixtureItem[] = [{}, {}]
    render(<Fixture {...{ items }} />)
    const useVirtualCalls = (useVirtual as jest.MockedFunction<typeof useVirtual>).mock.calls
    const firstCallArgs = useVirtualCalls[0]
    const firstCallOptions = firstCallArgs[0]
    expect(firstCallOptions.size).toBe(2)
  })

  test('should call use virtual with valid estimate if number was provided', () => {
    render(<Fixture estimate={42} />)
    const useVirtualCalls = (useVirtual as jest.MockedFunction<typeof useVirtual>).mock.calls
    const firstCallArgs = useVirtualCalls[0]
    const firstCallOptions = firstCallArgs[0]
    expect(firstCallOptions.estimateSize?.(0)).toBe(42)
  })

  test('should use estimate function in useVirtual estimate function', () => {
    const estimateFunctionSpy = jest.fn<number, [FixtureItem]>()
    const testItem: FixtureItem = {}
    const items: FixtureItem[] = [{}]
    render(<Fixture estimate={estimateFunctionSpy} {...{ items }} />)
    const useVirtualCalls = (useVirtual as jest.MockedFunction<typeof useVirtual>).mock.calls
    const firstCallArgs = useVirtualCalls[0]
    const firstCallOptions = firstCallArgs[0]
    firstCallOptions.estimateSize!(0)
    expect(estimateFunctionSpy).toHaveBeenCalledWith(testItem)
  })

  test('should call render function correct amount of times', () => {
    (useVirtual as jest.MockedFunction<typeof useVirtual>).mockReset()
    ;(useVirtual as jest.MockedFunction<typeof useVirtual>).mockReturnValueOnce({
      totalSize: 0,
      scrollToIndex: jest.fn(),
      scrollToOffset: jest.fn(),
      measure: jest.fn(),
      virtualItems: new Array(5).fill(null).map((_, index) => ({
        key: index,
        index,
        start: 0,
        end: 0,
        measureRef: (_) => 0,
        size: 0,
      })),
    })
    const renderElement = (_: RenderElementProps<FixtureItem>) => <div />
    render(<Fixture {...{ renderElement }} />)
    expect(screen.getByTestId('inner').childNodes.length).toBe(5)
  })

  test('should set styles for elements', () => {
    const itemHeight = 42
    ;(useVirtual as jest.MockedFunction<typeof useVirtual>).mockReset()
    ;(useVirtual as jest.MockedFunction<typeof useVirtual>).mockReturnValueOnce({
      totalSize: 0,
      scrollToIndex: jest.fn(),
      scrollToOffset: jest.fn(),
      measure: jest.fn(),
      virtualItems: new Array(5).fill(null).map((_, index) => ({
        key: index,
        index,
        start: index * itemHeight,
        end: 0,
        measureRef: (_) => 0,
        size: 0,
      })),
    })
    const renderElement = ({ style }: RenderElementProps<unknown>) => <div {...{ style }} />
    render(<Fixture {...{ renderElement }} />)
    expect(
      (Array.from(screen.getByTestId('inner').children) as HTMLElement[]).every(
        (element, index) =>
          element.style.transform === `translateY(${index * itemHeight}px)` &&
          element.style.position === 'absolute' &&
          element.style.top === '0px' &&
          element.style.left === '0px',
      ),
    ).toBeTruthy()
  })

  it('if focusedElement is set should call scrollToIndex', () => {
    render(<Fixture focusedIndex={42} />)
    expect(scrollToIndexSpy).toHaveBeenCalledWith(42, { align: 'auto' })
  })

  it('if focusedElement is not set should not call scrollToIndex', () => {
    render(<Fixture />)
    expect(scrollToIndexSpy).not.toHaveBeenCalled()
  })

  it("if focusedElement wasn't changed should not call scrollToIndex, and should call if was", () => {
    const { setProps } = render(<Fixture focusedIndex={42} />)
    setProps({ focusedIndex: 42 })
    expect(scrollToIndexSpy).toHaveBeenCalledTimes(1)

    setProps({ focusedIndex: 43 })
    expect(scrollToIndexSpy).toHaveBeenCalledTimes(2)
  })
})

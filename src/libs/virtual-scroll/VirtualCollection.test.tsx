import React, { FC, MutableRefObject, createRef } from 'react'

import { createClientRender, screen } from '../../libs/testing'
import { VirtualCollection } from './VirtualCollection'
import { VirtualCollectionProps } from './types'
import { useVirtualized } from './useVirtualized'

jest.mock('./useVirtualized')
const dummyContainerRef: MutableRefObject<null> = createRef()

export interface CollectionNode {
  text?: string
}

const Fixture: FC<Partial<VirtualCollectionProps<CollectionNode>>> = (props) => {
  const collection = props.collection ?? []
  const children = props.children ?? (() => <></>)
  const estimateSize = props.estimate ?? (() => 50)
  const { focusedIndex = null, height, maxHeight } = props

  return (
    <div data-testid="fixture">
      <VirtualCollection
        {...{ collection, estimate: estimateSize, focusedIndex, height, maxHeight }}
      >
        {children}
      </VirtualCollection>
    </div>
  )
}

function establishMocks() {
  (useVirtualized as jest.MockedFunction<typeof useVirtualized>).mockReturnValue({
    innerProps: {
      style: {
        position: 'relative',
        height: 420,
      },
    },
    containerProps: {
      ref: dummyContainerRef,
      style: {
        overflowY: 'auto',
      },
    },
    virtualItems: [new Array(5).fill(null).map((_, index) => <div key={index} />)],
  })
}

describe('VirtualCollection', () => {
  beforeAll(() => {
    establishMocks()
  })

  afterEach(() => {
    (useVirtualized as jest.MockedFunction<typeof useVirtualized>).mockReset()
    establishMocks()
    dummyContainerRef.current = null
  })

  const render = createClientRender()

  test('should call useVirtualized hook with valid items', () => {
    const collection: CollectionNode[] = [{ text: 'foo' }, { text: 'bar' }]
    render(<Fixture {...{ collection }} />)
    const options = (useVirtualized as jest.MockedFunction<typeof useVirtualized>).mock.calls[0][0]
    expect(options.items).toBe(collection)
  })

  test('should call useVirtualized hook with valid focused element', () => {
    render(<Fixture focusedIndex={42} />)
    const options = (useVirtualized as jest.MockedFunction<typeof useVirtualized>).mock.calls[0][0]
    expect(options.focusedIndex).toBe(42)
  })

  test('should set correct height of container', () => {
    render(<Fixture height={420} />)
    expect((screen.getByTestId('fixture').firstElementChild as HTMLElement).style.height).toBe(
      '420px',
    )
  })

  test('should set correct max-height of container', () => {
    render(<Fixture maxHeight={420} />)
    expect((screen.getByTestId('fixture').firstElementChild as HTMLElement).style.maxHeight).toBe(
      '420px',
    )
  })

  test('should pass estimate function to useVirtualized options', () => {
    const estimateSize = jest.fn()
    render(<Fixture {...{ estimate: estimateSize }} />)
    const options = (useVirtualized as jest.MockedFunction<typeof useVirtualized>).mock.calls[0][0]
    ;(options.estimate as (node: CollectionNode) => number)({ text: 'foo' })
    expect(estimateSize).toHaveBeenCalled()
  })

  test('should pass renderChildren to options', () => {
    const renderFn = jest.fn()
    render(<Fixture>{renderFn}</Fixture>)
    const options = (useVirtualized as jest.MockedFunction<typeof useVirtualized>).mock.calls[0][0]
    options.renderElement({ element: { text: 'foo' }, style: {} })
    expect(renderFn).toHaveBeenCalled()
  })

  test('should render default container', () => {
    render(<Fixture />)
    expect(
      (screen.getByTestId('fixture').firstElementChild as HTMLElement).tagName.toLowerCase(),
    ).toBe('div')
  })

  test('default container should have valid ref', () => {
    render(<Fixture />)
    expect(dummyContainerRef.current).toBe(screen.getByTestId('fixture').firstElementChild)
  })

  test('should render default inner', () => {
    render(<Fixture />)
    expect(
      (
        screen.getByTestId('fixture').firstElementChild?.firstElementChild as HTMLElement
      )?.tagName.toLowerCase(),
    ).toBe('div')
  })

  test('default inner should have valid position', () => {
    render(<Fixture />)
    expect(
      (screen.getByTestId('fixture').firstElementChild?.firstElementChild as HTMLElement)?.style
        .position,
    ).toBe('relative')
  })

  test('default inner should have valid height', () => {
    render(<Fixture />)
    expect(
      (screen.getByTestId('fixture').firstElementChild?.firstElementChild as HTMLElement)?.style
        .height,
    ).toBe('420px')
  })

  test('should render children', () => {
    render(<Fixture />)
    expect(
      (screen.getByTestId('fixture').firstElementChild?.firstElementChild as HTMLElement)
        ?.childNodes.length,
    ).toBe(5)
  })
})

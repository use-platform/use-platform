import { renderHook } from '../../internal/testing'
import { CollectionComponent, CollectionFactory, CollectionNode, CollectionProps } from './types'
import { useCollection } from './useCollection'

const Item: CollectionComponent = () => null
Item.getCollectionNode = function* (props) {
  yield {
    type: 'item',
    props,
    content: props.children,
    hasChildren: false,
  }
}

describe('useCollection', () => {
  test('should return memoized result', () => {
    const factory = jest.fn(((nodes) => nodes) as CollectionFactory<Iterable<CollectionNode>>)
    const initProps = { children: <Item>foo</Item> }

    const { result, rerender } = renderHook<Iterable<CollectionNode>, CollectionProps>(
      (props) => useCollection(props, factory),
      {
        initialProps: initProps,
      },
    )

    const a = result.current
    rerender(initProps)

    expect(a).toBe(result.current)
    expect(factory).toHaveBeenCalledTimes(1)
  })

  test('should return updated result if children have changed', () => {
    const factory = jest.fn(((nodes) => nodes) as CollectionFactory<Iterable<CollectionNode>>)
    const { result, rerender } = renderHook(
      ({ children }) => useCollection({ children }, factory),
      {
        initialProps: {
          children: <Item>foo</Item>,
        },
      },
    )

    expect(factory).toHaveBeenCalledTimes(1)

    const a = result.current
    rerender({ children: <Item>bar</Item> })

    expect(a).not.toBe(result.current)
    expect(factory).toHaveBeenCalledTimes(2)
  })
})

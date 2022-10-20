import { Children, Key, ReactNode } from 'react'

import { CollectionBuilder } from './CollectionBuilder'
import { CollectionComponent, CollectionNode } from './types'

interface CollectionItemProps {
  type?: string
  content?: ReactNode
  childType?: string
  children?: ReactNode
}

const CollectionItem: CollectionComponent<CollectionItemProps> = () => null
CollectionItem.getCollectionNode = function* (props) {
  const { type, content, childType, children } = props

  yield {
    type,
    content: content || children,
    hasChildren: Boolean(content) && Children.count(children) > 0,
    *children() {
      if (!content) {
        return
      }

      const items: ReactNode[] = []
      Children.forEach(children, (child) => {
        items.push(child)
      })

      for (const item of items) {
        yield {
          type: childType,
          element: item,
        }
      }
    },
  }
}

function forEach(collection: Iterable<CollectionNode>, cb: (node: CollectionNode) => void) {
  for (const node of collection) {
    cb(node)

    if (node.hasChildren) {
      forEach(node.children, cb)
    }
  }
}

describe('CollectionBuilder', () => {
  test('should throw error for non-collection component', () => {
    const builder = new CollectionBuilder()

    expect(() => {
      // @ts-expect-error
      Array.from(builder.build({ children: 'string' }))
    }).toThrowError('Unknown element')

    expect(() => {
      Array.from(builder.build({ children: <>Fragment</> }))
    }).toThrowError('Unknown element')

    expect(() => {
      Array.from(builder.build({ children: <div>container</div> }))
    }).toThrowError('Unknown element')
  })

  test('should generate key for item collection', () => {
    const builder = new CollectionBuilder()

    /* eslint-disable react/jsx-key */
    const nodes = builder.build({
      children: [
        <CollectionItem type="item">item 1</CollectionItem>,
        <CollectionItem type="item">item 2</CollectionItem>,
        <CollectionItem type="item">item 3</CollectionItem>,
      ],
    })
    /* eslint-enable  */

    const keys: Key[] = []
    forEach(nodes, (node) => keys.push(node.key))

    expect(keys).toEqual(['$.0', '$.1', '$.2'])
  })

  test('should use custom key for item collection', () => {
    const builder = new CollectionBuilder()

    /* eslint-disable react/jsx-key */
    const nodes = builder.build({
      children: [
        <CollectionItem type="item" key="foo">
          item 1
        </CollectionItem>,
        <CollectionItem type="item">item 2</CollectionItem>,
        <CollectionItem type="item" key="baz">
          item 3
        </CollectionItem>,
      ],
    })
    /* eslint-enable  */

    const keys: Key[] = []
    forEach(nodes, (node) => keys.push(node.key))

    expect(keys).toEqual(['foo', '$.1', 'baz'])
  })

  test('should generate key for nested item', () => {
    const builder = new CollectionBuilder()

    /* eslint-disable react/jsx-key */
    const nodes = builder.build({
      children: [
        <CollectionItem type="item" content="parent">
          <CollectionItem type="item">child</CollectionItem>
        </CollectionItem>,
        <CollectionItem type="item">item 2</CollectionItem>,
        <CollectionItem type="item">item 3</CollectionItem>,
      ],
    })
    /* eslint-enable  */

    const keys: Key[] = []
    forEach(nodes, (node) => keys.push(node.key))

    expect(keys).toEqual(['$.0', '$.0.0', '$.1', '$.2'])
  })

  test('should use custom key for nested item', () => {
    const builder = new CollectionBuilder()

    /* eslint-disable react/jsx-key */
    const nodes = builder.build({
      children: [
        <CollectionItem type="item" content="parent">
          <CollectionItem type="item" key="child">
            child
          </CollectionItem>
        </CollectionItem>,
      ],
    })
    /* eslint-enable  */

    const keys: Key[] = []
    forEach(nodes, (node) => keys.push(node.key))

    expect(keys).toEqual(['$.0', 'child'])
  })

  test('should throw error if children type is incorrect', () => {
    const builder = new CollectionBuilder()
    const nodes = builder.build({
      children: (
        <CollectionItem type="section" childType="item" content="Section">
          <CollectionItem type="section">Another section</CollectionItem>
        </CollectionItem>
      ),
    })

    expect(() => {
      forEach(nodes, () => null)
    }).toThrowError('Invalid node type. Expected: "item", actual: "section"')
  })

  test('should skip invalid collection items', () => {
    const builder = new CollectionBuilder()

    const nodes = builder.build({
      children: <CollectionItem>Item</CollectionItem>,
    })

    expect(Array.from(nodes)).toHaveLength(0)
  })
})

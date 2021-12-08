import { Story } from '@storybook/react'
import {
  Children,
  Key,
  ReactElement,
  ReactFragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'

import {
  CollectionBuilder,
  CollectionNode,
  CollectionProps,
  PartialCollectionNode,
  Renderer,
} from '..'

interface Collection<T> extends Iterable<T> {
  getFirstKey(): Key | null
  getLastKey(): Key | null
}

interface NodeInfo {
  key: Key
  parentKey: Key | null
  level: number
  nextKey: Key | null
  prevKey: Key | null
}

class TreeCollection<T> implements Collection<CollectionNode<T>> {
  private map: Map<Key, CollectionNode<T>>

  private info: Map<Key, NodeInfo>

  private firstKey: Key | null = null

  private lastKey: Key | null = null

  private nodes: Iterable<CollectionNode<T>>

  constructor(nodes: Iterable<CollectionNode<T>>) {
    this.nodes = nodes
    this.map = new Map()
    this.info = new Map()

    let last: NodeInfo | undefined = undefined

    const visit = (node: CollectionNode<T>, parentInfo?: NodeInfo) => {
      const level = parentInfo ? parentInfo.level + 1 : 0
      const info: NodeInfo = {
        key: node.key,
        level,
        nextKey: null,
        prevKey: last?.key ?? null,
        parentKey: parentInfo?.key ?? null,
      }

      this.map.set(node.key, node)
      this.info.set(node.key, info)

      if (last) {
        last.nextKey = node.key
      }

      if (this.firstKey == null) {
        this.firstKey = node.key
      }

      this.lastKey = node.key
      last = info

      for (const child of node.children) {
        visit(child, info)
      }
    }

    for (const node of nodes) {
      visit(node)
    }
  }

  getItem(key: Key) {
    return this.map.get(key)
  }

  getKeyBefore(key: Key) {
    const info = this.info.get(key)

    return info?.prevKey ?? null
  }

  getKeyAfter(key: Key) {
    const info = this.info.get(key)

    return info?.nextKey ?? null
  }

  getFirstKey() {
    return this.firstKey
  }

  getLastKey() {
    return this.lastKey
  }

  *[Symbol.iterator]() {
    yield* this.nodes
  }
}

interface TreeItemProps<T> {
  items?: T[]
  content?: ReactNode
  children?: Renderer<T> | ReactElement | ReactElement[] | ReactFragment
}

function TreeItem<T>(_props: TreeItemProps<T>) {
  return null
}

TreeItem.getCollectionNode = function* <T>(
  props: TreeItemProps<T>,
): Generator<PartialCollectionNode<T>> {
  const { children, content, items } = props

  yield {
    type: 'treeitem',
    props,
    content: content ?? children,
    *children() {
      if (typeof children === 'function' && items) {
        for (const value of items) {
          yield {
            type: 'treeitem',
            value,
            renderer: children as Renderer<T>,
          }
        }
      } else if (content) {
        const items: ReactNode[] = []
        Children.forEach(children, (child) => {
          items.push(child)
        })

        for (const child of items) {
          yield {
            type: 'treeitem',
            element: child,
          }
        }
      }
    },
  }
}

interface TreeState {
  expandedKeys: Set<Key>
  toggleKey: (key: Key) => void
}

function renderNodes<T>(collection: Iterable<CollectionNode<T>>, state: TreeState) {
  const nodes = [...collection]

  if (nodes.length) {
    return (
      <ul>
        {nodes.map((node) => (
          <li role="treeitem" key={node.key}>
            <span onClick={() => state.toggleKey(node.key)}>
              {state.expandedKeys.has(node.key) ? '-' : '+'} {node.content}
            </span>
            {state.expandedKeys.has(node.key) && renderNodes(node.children, state)}
          </li>
        ))}
      </ul>
    )
  }

  return null
}

function TreeView<T>(props: CollectionProps<T>) {
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(() => new Set())

  const toggleKey = useCallback((key: Key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }, [])

  const collection = useMemo(() => {
    const builder = new CollectionBuilder<T>()

    return new TreeCollection(builder.build(props))
  }, [props])

  return <div>{renderNodes(collection, { expandedKeys, toggleKey })}</div>
}

export const Default: Story = () => {
  return (
    <>
      <TreeView>
        <TreeItem content="Item 1">
          <TreeItem>Item 1.1</TreeItem>
          <TreeItem>Item 1.2</TreeItem>
        </TreeItem>

        <TreeItem content="Item 2">
          <TreeItem content="Item 2.1">
            <TreeItem>Item 2.1.1</TreeItem>
            <TreeItem>Item 2.1.2</TreeItem>
          </TreeItem>
          <TreeItem>Item 2.2</TreeItem>
        </TreeItem>

        <TreeItem content="Item 3">
          <TreeItem>Item 3.1</TreeItem>
        </TreeItem>
      </TreeView>
    </>
  )
}

import { Children, ReactNode } from 'react'

import { CacheableList } from './CacheableList'
import { CollectionElement, CollectionNode, CollectionProps, PartialCollectionNode } from './types'
import { isCollectionElement } from './utils'

export class CollectionBuilder {
  build(props: CollectionProps): Iterable<CollectionNode> {
    const { children } = props

    const builder = this

    return new CacheableList(function* () {
      const items: ReactNode[] = []

      Children.forEach(children, (child) => {
        items.push(child)
      })

      let index = 0
      for (const element of items) {
        const nodes = builder.getNodes({ element }, index)

        for (const node of nodes) {
          yield node
          index++
        }
      }
    })
  }

  private *getNodes(
    item: PartialCollectionNode,
    index: number,
    parent?: CollectionNode,
  ): Generator<CollectionNode> {
    const element = this.getCollectionElement(item)

    if (!element) {
      const node = this.createNode(item)

      if (node) {
        yield node
      }

      return
    }

    const nodes = element.type.getCollectionNode(element.props)

    for (const node of nodes) {
      const nodeKey = this.getKey(element, node, index, parent)
      const partialNodes = this.getNodes({ ...node, key: nodeKey }, index, parent)

      for (const partialNode of partialNodes) {
        // TODO: Возможно стоит выкидывать ошибку в дев режиме
        if (item.type && item.type !== partialNode.type) {
          throw new Error(
            `Invalid node type. Expected: "${item.type}", actual: "${partialNode.type}"`,
          )
        }

        yield partialNode

        index++
      }
    }
  }

  private createNode(item: PartialCollectionNode): CollectionNode | null {
    const { key, type, content, props = {}, hasChildren = false, children } = item

    if (key == null || type == null) {
      return null
    }

    const builder = this
    const node: CollectionNode = {
      type,
      key,
      props,
      content,
      hasChildren,
      children: new CacheableList(function* () {
        if (!children || !hasChildren) {
          return
        }

        let index = 0
        for (const child of children()) {
          const nodes = builder.getNodes(child, index, node)
          for (const node of nodes) {
            yield node

            index++
          }
        }
      }),
    }

    return node
  }

  private getCollectionElement(item: PartialCollectionNode) {
    let { element } = item

    if (element) {
      if (!isCollectionElement(element)) {
        throw new Error('Unknown element')
      }

      return element
    }

    return null
  }

  private getKey(
    element: CollectionElement,
    node: PartialCollectionNode,
    index: number,
    parent?: CollectionNode,
  ) {
    if (node.key != null) {
      return node.key
    }

    if (node.element) {
      return
    }

    if (element.key != null) {
      return element.key
    }

    return parent?.key ? `${parent?.key}.${index}` : `$.${index}`
  }
}

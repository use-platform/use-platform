import { Children, ReactNode } from 'react'

import { CacheableList } from './CacheableList'
import { CollectionElement, CollectionNode, CollectionProps, PartialCollectionNode } from './types'
import { isCollectionElement, isReactFragment, isRenderer } from './utils'

export class CollectionBuilder<T> {
  build(props: CollectionProps<T>) {
    const { children, items } = props

    const builder = this

    return new CacheableList(function* () {
      if (isRenderer<T>(children)) {
        if (!items) {
          throw new Error('props.items not provided')
        }

        let index = 0
        for (const value of items) {
          yield* builder.getNodes({ value, renderer: children }, index)
          index++
        }
      } else {
        const elements = builder.getCollectionElements(children)

        let index = 0
        for (const element of elements) {
          const nodes = builder.getNodes({ element }, index)

          for (const node of nodes) {
            yield node
            index++
          }
        }
      }
    })
  }

  private *getNodes(
    item: PartialCollectionNode<T>,
    index: number,
    parent?: CollectionNode<T>,
  ): Generator<CollectionNode<T>> {
    const element = this.getElement(item)

    if (!element) {
      const node = this.createNode(item)

      if (node) {
        yield node
      }

      return
    }

    if (isReactFragment(element)) {
      const elements = this.getCollectionElements(element)

      for (const el of elements) {
        yield* this.getNodes({ ...item, element: el }, index, parent)

        index++
      }

      return
    }

    const nodes = element.type.getCollectionNode(element.props)

    for (const node of nodes) {
      const nodeKey = this.getKey(element, node, index, parent)
      const partialNodes = this.getNodes({ ...node, key: nodeKey }, index, parent)

      for (const partialNode of partialNodes) {
        // TODO: Возможно выкидывать ошибку в дев режиме
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

  private createNode(item: PartialCollectionNode<T>): CollectionNode<T> | null {
    const { key, type, content, props = {}, children } = item

    if (key == null || type == null) {
      return null
    }

    const builder = this
    const node: CollectionNode<T> = {
      type,
      key,
      props,
      content,
      children: new CacheableList(function* () {
        if (!children) {
          return
        }

        let index = 0
        for (const child of children()) {
          if (child.key != null) {
            child.key = `${node.key}${child.key}`
          }

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

  private getElement(item: PartialCollectionNode<T>) {
    let { element } = item

    if (!element && item.renderer && item.value) {
      element = item.renderer(item.value)
    }

    if (element) {
      if (!isCollectionElement<T>(element) && !isReactFragment(element)) {
        throw new Error('Unknown element')
      }

      return element
    }

    return null
  }

  private getKey(
    element: CollectionElement<T>,
    node: PartialCollectionNode<T>,
    index: number,
    parent?: CollectionNode<T>,
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

  private getCollectionElements(children: ReactNode) {
    const elements: CollectionElement<T>[] = []

    Children.forEach(children, (child) => {
      if (isReactFragment(child)) {
        elements.push(...this.getCollectionElements(child.props.children))
      } else if (isCollectionElement<T>(child)) {
        elements.push(child)
      } else if (child) {
        throw new Error('Unknown element')
      }
    })

    return elements
  }
}

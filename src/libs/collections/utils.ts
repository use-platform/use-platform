import { ReactElement, ReactNode, isValidElement } from 'react'

import { CollectionComponent } from './types'

export function isCollectionElement<T = {}>(
  node: ReactNode,
): node is ReactElement<T, CollectionComponent<T>> {
  return (
    isValidElement(node) &&
    typeof node.type === 'function' &&
    typeof (node.type as CollectionComponent).getCollectionNode === 'function'
  )
}

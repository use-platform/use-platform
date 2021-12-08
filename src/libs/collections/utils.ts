import { Fragment, ReactElement, ReactNode, isValidElement } from 'react'

import { CollectionComponent, Renderer } from './types'

export function isReactFragment(node: ReactNode): node is ReactElement<{ children?: ReactNode }> {
  return isValidElement(node) && node.type === Fragment
}

export function isCollectionElement<T = unknown, P = {}>(
  node: ReactNode,
): node is ReactElement<P, CollectionComponent<T, P>> {
  return (
    isValidElement(node) &&
    typeof node.type === 'function' &&
    typeof (node.type as CollectionComponent).getCollectionNode === 'function'
  )
}

// TODO: Подумать про кейс с ReactFragment и как избавиться от этой функции
export function isRenderer<T>(value: unknown): value is Renderer<T> {
  return typeof value === 'function'
}

import { FC, Key, PropsWithChildren, ReactElement, ReactNode } from 'react'

export interface PartialCollectionNode {
  type?: string
  key?: Key
  element?: ReactNode
  props?: any
  content?: ReactNode
  hasChildren?: boolean
  children?: () => Iterable<PartialCollectionNode>
}

export interface CollectionNode {
  type: string
  key: Key
  props: any
  content: ReactNode
  hasChildren: boolean
  children: Iterable<CollectionNode>
}

export interface CollectionComponent<T = {}> extends FC<PropsWithChildren<T>> {
  getCollectionNode(props: PropsWithChildren<T>): Iterable<PartialCollectionNode>
}

export type CollectionElement<P = {}> = ReactElement<P, CollectionComponent<P>>

export interface CollectionProps {
  children: CollectionElement | CollectionElement[]
}

export type CollectionFactory<T> = (nodes: Iterable<CollectionNode>) => T

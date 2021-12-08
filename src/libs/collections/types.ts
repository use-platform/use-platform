import { FC, Key, ReactElement, ReactFragment, ReactNode } from 'react'

// TODO: May be move to common types
export type Renderer<T> = (value: T) => ReactElement

export interface PartialCollectionNode<T> {
  type?: string
  key?: Key
  element?: ReactNode
  props?: any
  content?: ReactNode
  // TODO: Возможно value и renderer здесь не нужен
  value?: T
  renderer?: Renderer<T>
  children?: () => Iterable<PartialCollectionNode<T>>
}

// TODO: Здесь у нас нет информации про value, а значит возможно и не нужен generic тип
export interface CollectionNode<T> {
  type: string
  key: Key
  props: any
  content: ReactNode
  // TODO: чтобы узнать наличие детей у ноды, нужно спредить или вызвать `Array.from`,
  // что в целом не очень оптимально. Нужно как-то разрулить такой кейс
  children: Iterable<CollectionNode<T>>
}

export interface CollectionComponent<T = unknown, P = {}> extends FC<T> {
  getCollectionNode(props: P): Iterable<PartialCollectionNode<T>>
}

export type CollectionElement<T = unknown, P = {}> = ReactElement<P, CollectionComponent<T, P>>

export interface CollectionProps<T> {
  children?: ReactFragment | CollectionElement<T> | CollectionElement<T>[] | Renderer<T>
  items?: Iterable<T>
}

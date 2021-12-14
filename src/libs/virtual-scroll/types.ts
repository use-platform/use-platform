import { CSSProperties, ReactNode, RefObject } from 'react'

export interface RenderElementProps<T> {
  element: T
  style: CSSProperties
}

export interface UseVirtualizedProps<T> {
  items: T[]
  renderElement: (props: RenderElementProps<T>) => ReactNode
  estimate: number | ((elem: T) => number)
  focusedIndex: number | null
}

export interface VirtualizedContainerProps<U extends HTMLElement = HTMLDivElement> {
  ref: RefObject<U>
  style: CSSProperties
}

export interface VirtualizedInnerProps {
  style: CSSProperties
}

export interface UseVirtualizedResult<T extends HTMLElement = HTMLDivElement> {
  innerProps: VirtualizedInnerProps
  containerProps: VirtualizedContainerProps<T>
  virtualItems: ReactNode[]
}

export interface VirtualizedElementProps<T> {
  element: T
}

export interface VirtualCollectionProps<T = unknown> {
  collection: T[]
  children: (props: VirtualizedElementProps<T>) => ReactNode
  estimate: number | ((node: T) => number)
  focusedIndex: number | null
  height?: number | string
  maxHeight?: number | string
}

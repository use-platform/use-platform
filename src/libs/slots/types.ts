import { FC, PropsWithChildren, ReactNode } from 'react'

export interface SlotComponent<T = {}> extends FC<PropsWithChildren<T>> {
  /**
   * @internal
   */
  __slotName: string
}

export interface SlotItem<T = {}> {
  name: string
  props: PropsWithChildren<T>
  rendered: ReactNode
}

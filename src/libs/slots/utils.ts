import {
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  isValidElement,
} from 'react'

import type { SlotComponent } from './types'

export function isSlotElement<P = {}>(
  node: ReactNode,
): node is ReactElement<PropsWithChildren<P>, SlotComponent<P>> {
  return isValidElement(node) && isSlotComponent(node.type)
}

export function isSlotComponent<T = {}>(
  type: string | JSXElementConstructor<any>,
): type is SlotComponent<T> {
  return typeof type === 'function' && '__slotName' in type
}

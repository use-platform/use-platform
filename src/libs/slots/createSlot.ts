import { FC, PropsWithChildren } from 'react'

import type { SlotComponent } from './types'

export function createSlot<T = {}>(name = 'unknown'): FC<PropsWithChildren<T>> {
  const Slot: SlotComponent<T> = () => null

  Slot.displayName = `Slot(${name})`
  Slot.__slotName = name

  return Slot
}

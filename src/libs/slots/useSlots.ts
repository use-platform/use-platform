import { ReactNode, useMemo } from 'react'

import { SlotMap, SlotMapOptions } from './SlotMap'

export interface UseSlotsProps {
  children?: ReactNode
}

export function useSlots(props: UseSlotsProps, options: SlotMapOptions = {}) {
  const { children } = props
  const { defaultSlot } = options

  const slots = useMemo(() => {
    return new SlotMap(children, { defaultSlot })
  }, [children, defaultSlot])

  return slots
}

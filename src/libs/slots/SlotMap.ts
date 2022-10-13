import { Children, FC, ReactNode } from 'react'

import type { SlotComponent, SlotItem } from './types'
import { isSlotComponent, isSlotElement } from './utils'

export interface SlotMapOptions {
  defaultSlot?: FC<any>
}

export class SlotMap {
  private slots: Map<SlotComponent, SlotItem>

  readonly children?: ReactNode = null

  constructor(children: ReactNode, options: SlotMapOptions = {}) {
    const { defaultSlot } = options
    const defaultContent: ReactNode[] = []

    this.slots = new Map()

    if (defaultSlot && !isSlotComponent(defaultSlot)) {
      throw new Error(
        'Invalid default slot component. Should be a component created using "createSlot".',
      )
    }

    Children.forEach(children, (child) => {
      if (isSlotElement(child)) {
        const { type, props } = child

        if (this.slots.has(type)) {
          throw new Error(`Duplicate slot elements with name "${type.__slotName}" found.`)
        }

        this.slots.set(type, {
          name: type.__slotName,
          props,
          rendered: props.children,
        })
      } else if (child !== null && child !== undefined) {
        defaultContent.push(child)
      }
    })

    const defaultSlotItem = defaultSlot ? this.slots.get(defaultSlot) : undefined
    const hasContent = defaultContent.length > 0

    if (defaultSlotItem && hasContent) {
      throw new Error(
        `Extraneous children found when component already has explicitly default slot with name "${defaultSlotItem.name}".`,
      )
    }

    if (defaultSlotItem) {
      this.children = defaultSlotItem.rendered
    } else if (hasContent) {
      this.children = defaultContent
    }
  }

  get<T>(slot: FC<T>): SlotItem<T> | undefined {
    if (!isSlotComponent(slot)) {
      throw new Error('Invalid slot component. Should be a component created using "createSlot".')
    }

    return this.slots.get(slot) as SlotItem<T>
  }
}

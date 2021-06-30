import type { PressSource } from '../../types'

export interface BasePressEvent {
  source: PressSource
  target: HTMLElement
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export function createPressEvent(event: any, source: PressSource): BasePressEvent {
  return {
    source,
    target: event.target,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
  }
}

import type { BasePressEvent, PressSource } from '../../../shared/types'

interface PressSourceEvent {
  target: EventTarget | null
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export function createPressEvent<T = HTMLElement>(
  event: PressSourceEvent,
  currentTarget: T,
  source: PressSource,
): BasePressEvent<T> {
  return {
    source,
    target: event.target,
    currentTarget,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
  }
}

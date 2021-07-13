import type { PressSource } from '../../../shared/types'

export interface BasePressEvent<T extends HTMLElement = HTMLElement> {
  source: PressSource
  target: T
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export function createPressEvent<T extends HTMLElement = HTMLElement>(
  event: any,
  source: PressSource,
): BasePressEvent<T> {
  return {
    source,
    target: event.target,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
  }
}

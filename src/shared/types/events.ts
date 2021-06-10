export type PressSource = 'mouse' | 'pen' | 'touch' | 'keyboard'

export interface PressEvent<T = HTMLElement> {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press'
  source: PressSource
  target: T
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export type PressEventHandler<T> = (event: PressEvent<T>) => void

import { FocusEventHandler, KeyboardEventHandler } from 'react'

export type PressSource = 'mouse' | 'pen' | 'touch' | 'keyboard'

export interface BasePressEvent<T = HTMLElement> {
  source: PressSource
  target: EventTarget | null
  currentTarget: T
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export interface PressEvent<T = HTMLElement> extends BasePressEvent<T> {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press'
}

export type PressEventHandler<T> = (event: PressEvent<T>) => void

export interface PressEventProps<T = HTMLElement> {
  onPress?: PressEventHandler<T>
  onPressEnd?: PressEventHandler<T>
  onPressStart?: PressEventHandler<T>
  onPressUp?: PressEventHandler<T>
}

export interface FocusEventProps<T = HTMLElement> {
  onBlur?: FocusEventHandler<T>
  onFocus?: FocusEventHandler<T>
}

export interface KeyboardEventProps<T = HTMLElement> {
  onKeyDown?: KeyboardEventHandler<T>
  onKeyPress?: KeyboardEventHandler<T>
  onKeyUp?: KeyboardEventHandler<T>
}

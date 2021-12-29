import { RefObject } from 'react'

export interface OverlayCloseEvent {
  nativeEvent: KeyboardEvent | MouseEvent
  source: 'esc' | 'click'
}
export type OnClose = (event: OverlayCloseEvent) => void

export type CloseStrategy = 'pressdown' | 'pressup'

export interface VirtualElement {
  getBoundingClientRect: () => DOMRect
  contextElement?: Element
}

export type RefHTMLElement = {
  readonly current: VirtualElement | HTMLElement | null
}

export interface OverlayOptions {
  onClose?: OnClose
  refs: RefHTMLElement[]
  closeStrategy: CloseStrategy
}

export interface UseOverlayOptions {
  /**
   * Layer visibility
   */
  visible?: boolean

  /**
   * Handler that will be called on outside click/escape press
   */
  onClose?: OnClose

  /**
   * DOM-nodes refs to exclude from click tracking
   */
  essentialRefs: RefObject<HTMLElement | VirtualElement>[]

  /**
   * Layer close startegy.
   * `pressdown` - close on mouse press (mousedown)
   * `pressup` - close on mouse release (click)
   *
   * @default 'pressdown'
   * @internal
   */
  // eslint-disable-next-line camelcase
  unsafe_strategy?: CloseStrategy
}

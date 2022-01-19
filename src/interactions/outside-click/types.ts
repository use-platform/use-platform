export type UseOutsideClickTriggerStrategy = 'pressdown' | 'pressup'

export interface UseOutsideClickVirtualElement {
  getBoundingClientRect: () => DOMRect
  contextElement?: Element
}

export type UseOutsideClickRefHTMLElement = {
  readonly current: UseOutsideClickVirtualElement | HTMLElement | null
}

export interface UseOutsideClickProps {
  onAction: (event: Event) => void
  refs: UseOutsideClickRefHTMLElement[]
  triggerStrategy: UseOutsideClickTriggerStrategy
  disabled?: boolean
}

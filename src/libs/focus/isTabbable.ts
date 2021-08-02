import { adjustedTabIndex } from './adjustedTabIndex'
import { isFocusable } from './isFocusable'
import { isIframe } from './utils'

export function isTabbable(node: HTMLElement) {
  return !isIframe(node) && isFocusable(node) && adjustedTabIndex(node) >= 0
}

import { focusElement } from '../../dom-utils'
import { getTabbables } from './tabbable'

const FOCUS_TRAP_GUARD_ATTR = 'focusTrapGuard'

export function getActiveElement() {
  return document.activeElement as HTMLElement | null
}

export function isElementInScope(scope: Element, element: Element) {
  return scope.contains(element)
}

export function isFocusFree() {
  return getActiveElement() === document.body
}

export function createGuard(tabIndex: number) {
  const element = document.createElement('span')
  element.tabIndex = tabIndex
  Object.assign(element.style, {
    width: '1px',
    height: 0,
    padding: 0,
    overflow: 'hidden',
    position: 'fixed',
    top: '1px',
    left: '1px',
  })
  element.setAttribute('aria-hidden', 'true')
  element.dataset[FOCUS_TRAP_GUARD_ATTR] = 'true'

  return element
}

export function isGuard(node: HTMLElement) {
  return Boolean(node.dataset[FOCUS_TRAP_GUARD_ATTR])
}

export function removeElementFromDocument(element: Element) {
  if (!element.parentNode) {
    return
  }

  element.parentNode.removeChild(element)
}

export function focusFirstIn(scope: HTMLElement) {
  const [first] = getTabbables(scope, (node) => !isGuard(node))

  focusElement(first)
}

export function getNextTabbableIndex(current: number, count: number, step: number) {
  if (current === -1) {
    return 0
  }

  return count > 0 ? (count + current + step) % count : -1
}

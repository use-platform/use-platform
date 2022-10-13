import { canUseDom } from '../dom-utils'
import { isIOS } from '../platform'
import * as StandartScrollLocker from './StandartScrollLocker'
import * as TouchScrollLocker from './TouchScrollLocker'

function ensureElement(element?: HTMLElement | null) {
  return element || document.body
}

/**
 * Adds a lock on content scrolling on a DOM-element.
 *
 * @param container Link on DOM-element. Default: `document.body`
 */
export function lock(container?: HTMLElement | null) {
  if (!canUseDom) {
    return
  }

  const element = ensureElement(container)

  StandartScrollLocker.lock(element)

  if (isIOS()) {
    TouchScrollLocker.lock(element)
  }
}

/**
 * Removes the lock on content scrolling on a DOM-element.
 *
 * @param container Link on DOM-element. Default: `document.body`
 */
export function unlock(container?: HTMLElement | null) {
  if (!canUseDom) {
    return
  }

  const element = ensureElement(container)

  StandartScrollLocker.unlock(element)

  if (isIOS()) {
    TouchScrollLocker.unlock(element)
  }
}

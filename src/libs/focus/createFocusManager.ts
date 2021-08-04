import { RefObject } from 'react'

import { focusElement } from '../dom-utils'
import { FocusNavigation, FocusNavigationOptions } from './FocusNavigation'

type FocusOptions = {
  preventScroll?: boolean
  tabbable?: boolean
}

type FocusManagerOptions = FocusOptions & FocusNavigationOptions

export interface FocusManager {
  focusFirst(options?: FocusOptions): HTMLElement | null
  focusLast(options?: FocusOptions): HTMLElement | null
  focusNext(options?: FocusManagerOptions): HTMLElement | null
  focusPrevious(options?: FocusManagerOptions): HTMLElement | null
}

export function createFocusManager<T extends HTMLElement>(scopeRef: RefObject<T>): FocusManager {
  let instance: FocusNavigation | null = null

  function ensureNavigation<T>(callback: (instance: FocusNavigation) => T): T | null {
    if (scopeRef.current && instance?.scope !== scopeRef.current) {
      instance = new FocusNavigation(scopeRef.current)
    }

    if (instance) {
      return callback(instance)
    }

    return null
  }

  function focusFirst(options: FocusOptions = {}) {
    const { preventScroll, tabbable } = options
    const element = ensureNavigation((navigation) => navigation.first(tabbable))

    focusElement(element, preventScroll)

    return element
  }

  function focusLast(options: FocusOptions = {}) {
    const { preventScroll, tabbable } = options
    const element = ensureNavigation((navigation) => navigation.last(tabbable))

    focusElement(element, preventScroll)

    return element
  }

  function focusNext(options: FocusManagerOptions = {}) {
    const { preventScroll, ...opts } = options
    const element = ensureNavigation((navigation) => navigation.next(opts))

    focusElement(element, preventScroll)

    return element
  }

  function focusPrevious(options: FocusManagerOptions = {}) {
    const { preventScroll, ...opts } = options
    const element = ensureNavigation((navigation) => navigation.previous(opts))

    focusElement(element, preventScroll)

    return element
  }

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  }
}

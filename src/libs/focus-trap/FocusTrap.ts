import { FocusTrapManager } from './FocusTrapManager'
import { createGuard, removeElementFromDocument } from './utils'
import { FocusTrapInstance, FocusTrapOptions } from './types'

export class FocusTrap implements FocusTrapInstance {
  private manager: FocusTrapManager

  private options: FocusTrapOptions = { autoFocus: true }

  private scope: HTMLElement

  private active = false

  private cleanupFns: Array<() => void> = []

  constructor(manager: FocusTrapManager, scope: HTMLElement, options: FocusTrapOptions = {}) {
    this.manager = manager
    this.scope = scope
    this.setOptions(options)
  }

  /**
   * Returns trapped html element.
   */
  getScope() {
    return this.scope
  }

  /**
   * Activates focus trap.
   */
  activate() {
    if (this.active) {
      return
    }

    this.active = true
    this.attachGuards()
    this.activateInManager()
  }

  /**
   * Deactivates focus trap.
   */
  deactivate() {
    if (!this.active) {
      return
    }

    this.active = false
    this.cleanupFns.forEach((fn) => fn())
    this.cleanupFns = []
  }

  /**
   * Returns focus trap options.
   */
  getOptions() {
    return this.options
  }

  /**
   * Sets focus trap options.
   */
  setOptions(options: FocusTrapOptions) {
    this.options = { ...this.options, ...options }
  }

  private attachGuards() {
    const beforeElement = createGuard(1)
    const afterElement = createGuard(0)

    this.scope.insertAdjacentElement('beforebegin', beforeElement)
    this.scope.insertAdjacentElement('afterend', afterElement)

    this.cleanupFns.push(() => {
      removeElementFromDocument(beforeElement)
      removeElementFromDocument(afterElement)
    })
  }

  private activateInManager() {
    this.manager.activate(this)
    this.cleanupFns.push(() => {
      this.manager.deactivate(this)
    })
  }
}

/**
 * Creates focus trap for selected dom-node.
 *
 * @example
 * createFocusTrap(scopeDomNode, { autoFocus: true })
 */
export function createFocusTrap(scope: HTMLElement, options: FocusTrapOptions = {}) {
  const manager = FocusTrapManager.getInstance()

  return new FocusTrap(manager, scope, options)
}

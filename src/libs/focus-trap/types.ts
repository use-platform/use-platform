export interface FocusTrapOptions {
  /**
   * Sets focus in first interactive or autofocusable element inside trap.
   *
   * @default true
   */
  autoFocus?: boolean
}

export interface FocusTrapInstance {
  /**
   * Activates focus trap.
   */
  activate(): void
  /**
   * Deactivates focus trap.
   */
  deactivate(): void
  /**
   * Returns focus trap options.
   */
  getOptions(): FocusTrapOptions
  /**
   * Returns trapped dom-node.
   */
  getScope(): HTMLElement
  /**
   * Sets focus trap options.
   */
  setOptions(options: FocusTrapOptions): void
}

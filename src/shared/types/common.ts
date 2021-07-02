export type RangeValue<T> = {
  /**
   * The start value of the range.
   */
  start: T

  /**
   * The end value of the range.
   */
  end: T
}

export interface ValueProps2<T> {
  /**
   * The current value.
   */
  value?: T

  /**
   * The default value (uncontrolled mode).
   */
  defaultValue?: T

  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: T) => void
}

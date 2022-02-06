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

export type DateValue = Date | number

export type MaybeDateValue = DateValue | null

export type DateRangeValue = RangeValue<Date | null>

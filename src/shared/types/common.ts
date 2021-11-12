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

/**
 * @deprecated Use `DateValue` instead.
 */
export type DateLike = DateValue

export type MaybeDateValue = DateValue | null

export type DateRangeValue = RangeValue<MaybeDateValue>

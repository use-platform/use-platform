import { setYear } from '../../libs/date'
import { DateTimeEditableSegmentTypes } from './types'

export const EXTRA_STEP: Partial<Record<DateTimeEditableSegmentTypes, number>> = {
  year: 10,
  month: 3,
  day: 7,
  hour: 2,
  minute: 5,
  second: 5,
}

// 0001-01-01T00:00:00
export const MIN_DEFAULT_DATE = setYear(new Date(0, 0, 1, 0, 0, 0, 0), 1)

// 9999-12-31T23:59:59
export const MAX_DEFAULT_DATE = new Date(9999, 12, 0, 23, 59, 59, 999)

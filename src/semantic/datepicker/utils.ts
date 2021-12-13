import { DateValue } from '../../shared/types'

/**
 * Uses time from second date for first (if first hasn't time).
 */
export function getDateWithTime(date: DateValue, time: DateValue): Date {
  const nextDate = new Date(date)

  const hasTime = Boolean(
    nextDate.getHours() ||
      nextDate.getMinutes() ||
      nextDate.getSeconds() ||
      nextDate.getMilliseconds(),
  )

  if (hasTime) {
    return new Date(date)
  }

  time = new Date(time)

  nextDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())

  return nextDate
}

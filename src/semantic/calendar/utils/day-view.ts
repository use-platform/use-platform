import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  getDaysInMonth,
  lastDayOfMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'

import { DayOfWeek } from '../../../libs/i18n'
import { CalendarNavigationAction } from '../types'

export function durationInDayViews(start: Date, end: Date) {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
}

export function getDayViewData(viewDate: Date, options: { firstDayOfWeek?: DayOfWeek } = {}) {
  const { firstDayOfWeek = 0 } = options
  const data: Date[][] = []

  const month = viewDate.getMonth()
  const year = viewDate.getFullYear()

  let monthStartsAt = (startOfMonth(viewDate).getDay() - firstDayOfWeek) % 7
  if (monthStartsAt < 0) {
    monthStartsAt += 7
  }

  const daysInMonth = getDaysInMonth(viewDate)
  const weeksInMonth = Math.ceil((monthStartsAt + daysInMonth) / 7)

  for (let weekIndex = 0; weekIndex < weeksInMonth; weekIndex++) {
    data.push([])

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = weekIndex * 7 + dayIndex - monthStartsAt + 1
      const value = new Date(year, month, day)

      data[weekIndex].push(value)
    }
  }

  return data
}

export function moveInDayView(
  date: Date,
  action: CalendarNavigationAction,
  options: { firstDayOfWeek?: DayOfWeek } = {},
) {
  const { firstDayOfWeek } = options

  switch (action) {
    case CalendarNavigationAction.NextCell:
      return addDays(date, 1)

    case CalendarNavigationAction.PrevCell:
      return subDays(date, 1)

    case CalendarNavigationAction.LowerCell:
      return addWeeks(date, 1)

    case CalendarNavigationAction.UpperCell:
      return subWeeks(date, 1)

    case CalendarNavigationAction.FirstCell:
      return startOfMonth(date)

    case CalendarNavigationAction.LastCell:
      return lastDayOfMonth(date)

    case CalendarNavigationAction.StartCell:
      return startOfWeek(date, { weekStartsOn: firstDayOfWeek })

    case CalendarNavigationAction.EndCell:
      return endOfWeek(date, { weekStartsOn: firstDayOfWeek })

    case CalendarNavigationAction.PrevView:
      return subMonths(date, 1)

    case CalendarNavigationAction.NextView:
      return addMonths(date, 1)

    case CalendarNavigationAction.PrevExtraView:
      return subYears(date, 1)

    case CalendarNavigationAction.NextExtraView:
      return addYears(date, 1)

    default:
      return date
  }
}

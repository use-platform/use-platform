import { clamp } from '../../../libs/utils'
import {
  addMonths,
  addYears,
  endOfMonth,
  endOfYear,
  isSameDay,
  isSameMonth,
  isSameYear,
  set,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
  isEqual,
} from '../../../libs/date'
import { DayOfWeek } from '../../../libs/i18n'
import { RangeValue } from '../../../shared/types'
import { CalendarNavigationAction, CalendarView, CalendarViewData } from '../types'
import { durationInDayViews, getDayViewData, moveInDayView } from './day-view'
import { durationInMonthViews, getMonthViewData, moveInMonthView } from './month-view'
import {
  addYearViews,
  durationInYearViews,
  endOfYearView,
  getYearViewData,
  moveInYearView,
  startOfYearView,
  subYearViews,
} from './year-view'

export const isEqualDate = isEqual

export function createRange(start: Date, end: Date): RangeValue<Date> {
  if (end < start) {
    return { start: end, end: start }
  }

  return { start, end }
}

export function startOfView(view: CalendarView, value: Date) {
  const utils = {
    day: startOfMonth,
    month: startOfYear,
    year: startOfYearView,
  }

  return utils[view](value)
}

export function endOfView(view: CalendarView, date: Date) {
  const utils = {
    day: endOfMonth,
    month: endOfYear,
    year: endOfYearView,
  }

  return utils[view](date)
}

export function startOfCell(view: CalendarView, date: Date) {
  const utils = {
    day: startOfDay,
    month: startOfMonth,
    year: startOfYear,
  }

  return utils[view](date)
}

export function durationInViews(view: CalendarView, start: Date, end: Date) {
  const utils = {
    day: durationInDayViews,
    month: durationInMonthViews,
    year: durationInYearViews,
  }

  return utils[view](start, end)
}

export function addViews(view: CalendarView, date: Date, amount: number) {
  const utils = {
    day: addMonths,
    month: addYears,
    year: addYearViews,
  }

  return utils[view](date, amount)
}

export function subViews(view: CalendarView, date: Date, amount: number) {
  const utils = {
    day: subMonths,
    month: subYears,
    year: subYearViews,
  }

  return utils[view](date, amount)
}

export function nearest(view: CalendarView, candidate: Date, min: Date, total: number) {
  const distanceToStart = durationInViews(view, candidate, min)
  const distanceToEnd = distanceToStart + total - 1

  if (distanceToStart > 0 || distanceToEnd < 0) {
    const amount =
      Math.abs(distanceToStart) < Math.abs(distanceToEnd) ? distanceToStart : distanceToEnd

    return addViews(view, candidate, amount)
  }

  return candidate
}

export function isSameView(view: CalendarView, leftDate: Date, rightDate: Date) {
  return durationInViews(view, leftDate, rightDate) === 0
}

export function isInRange(view: CalendarView, candidate: Date, min: Date, max: Date) {
  const value = startOfCell(view, candidate)

  return value >= startOfCell(view, min) && value <= startOfCell(view, max)
}

export function isSameCell(view: CalendarView, leftDate: Date, rightDate: Date) {
  const utils = {
    day: isSameDay,
    month: isSameMonth,
    year: isSameYear,
  }

  return utils[view](leftDate, rightDate)
}

export function clampDate(date: Date, min: Date, max: Date) {
  const timestamp = clamp(date.getTime(), min.getTime(), max.getTime())

  return startOfDay(timestamp)
}

export function getViewData(
  view: CalendarView,
  viewDate: Date,
  options?: { firstDayOfWeek?: DayOfWeek },
) {
  const utils = {
    day: getDayViewData,
    month: getMonthViewData,
    year: getYearViewData,
  }

  return utils[view](viewDate, options)
}

export function move(
  view: CalendarView,
  date: Date,
  action: CalendarNavigationAction,
  options?: { firstDayOfWeek?: DayOfWeek },
) {
  const utils = {
    day: moveInDayView,
    month: moveInMonthView,
    year: moveInYearView,
  }

  return utils[view](date, action, options)
}

export function closestViewDate(view: CalendarView, start: Date, total: number, target: Date) {
  const maxIndex = total - 1
  const duration = durationInViews(view, start, target)

  const offset = Math.min(duration, 0) + Math.max(duration, maxIndex) - maxIndex

  if (offset !== 0) {
    return addViews(view, start, offset)
  }

  return start
}

// TODO: rename
export function getViewDate(view: CalendarView, baseDate: Date, focusedDate: Date) {
  const day = focusedDate.getDate()
  const month = focusedDate.getMonth()

  const utils = {
    day: (v: Date) => v,
    month: (v: Date) => set(v, { date: day }),
    year: (v: Date) => set(v, { date: day, month }),
  }

  return utils[view](baseDate)
}

export function getViews(
  view: CalendarView,
  baseDate: Date,
  count: number,
  options?: { firstDayOfWeek?: DayOfWeek },
) {
  const result: CalendarViewData[] = []

  for (let index = 0; index < count; index++) {
    const viewDate = addViews(view, baseDate, index)
    const start = startOfView(view, viewDate)
    const end = endOfView(view, viewDate)
    const viewRange = createRange(start, end)

    result.push({
      viewDate,
      viewRange,
      data: getViewData(view, viewDate, options),
    })
  }

  return result
}

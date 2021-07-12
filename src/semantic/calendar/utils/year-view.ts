import { addYears, endOfYear, setYear, startOfYear, subYears } from 'date-fns'

import { CalendarNavigationAction } from '../types'

const YEAR_VIEW_ROW_COUNT = 6

const YEAR_VIEW_COL_COUNT = 4

const YEAR_VIEW_TOTAL_COUNT = YEAR_VIEW_ROW_COUNT * YEAR_VIEW_COL_COUNT

function getStartYearOfView(date: Date) {
  return Math.floor(date.getFullYear() / YEAR_VIEW_TOTAL_COUNT) * YEAR_VIEW_TOTAL_COUNT
}

function getEndYearOfView(date: Date) {
  return getStartYearOfView(date) + YEAR_VIEW_TOTAL_COUNT - 1
}

export function startOfYearView(date: Date) {
  const year = getStartYearOfView(date)

  return startOfYear(setYear(date, year))
}

export function endOfYearView(date: Date) {
  const year = getEndYearOfView(date)

  return endOfYear(setYear(date, year))
}

export function durationInYearViews(start: Date, end: Date) {
  const startYear = getStartYearOfView(start)
  const endYear = getStartYearOfView(end)

  return (endYear - startYear) / YEAR_VIEW_TOTAL_COUNT
}

export function addYearViews(date: Date, amount: number) {
  return addYears(date, amount * YEAR_VIEW_TOTAL_COUNT)
}

export function subYearViews(date: Date, amount: number) {
  return subYears(date, amount * YEAR_VIEW_TOTAL_COUNT)
}

export function getYearViewData(viewDate: Date) {
  const data: Date[][] = []

  for (let row = 0, index = 0; row < YEAR_VIEW_ROW_COUNT; row++) {
    data.push([])

    for (let col = 0; col < YEAR_VIEW_COL_COUNT; col++) {
      data[row].push(addYears(viewDate, index++))
    }
  }

  return data
}

export function moveInYearView(date: Date, action: CalendarNavigationAction) {
  switch (action) {
    case CalendarNavigationAction.NextCell:
      return addYears(date, 1)

    case CalendarNavigationAction.PrevCell:
      return subYears(date, 1)

    case CalendarNavigationAction.LowerCell:
      return addYears(date, YEAR_VIEW_COL_COUNT)

    case CalendarNavigationAction.UpperCell:
      return subYears(date, YEAR_VIEW_COL_COUNT)

    case CalendarNavigationAction.StartCell:
    case CalendarNavigationAction.FirstCell:
      return setYear(date, getStartYearOfView(date))

    case CalendarNavigationAction.EndCell:
    case CalendarNavigationAction.LastCell:
      return setYear(date, getEndYearOfView(date))

    case CalendarNavigationAction.PrevView:
      return subYearViews(date, 1)

    case CalendarNavigationAction.NextView:
      return addYearViews(date, 1)

    default:
      return date
  }
}

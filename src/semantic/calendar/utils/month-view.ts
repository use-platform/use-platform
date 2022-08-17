import { addMonths, addYears, setMonth, subMonths, subYears } from '../../../internal/date'
import { CalendarNavigationAction } from '../types'

const MONTH_VIEW_ROW_COUNT = 4

const MONTH_VIEW_COL_COUNT = 3

export function durationInMonthViews(start: Date, end: Date) {
  return end.getFullYear() - start.getFullYear()
}

export function getMonthViewData(viewDate: Date) {
  const data: Date[][] = []

  for (let row = 0, index = 0; row < MONTH_VIEW_ROW_COUNT; row++) {
    data.push([])
    for (let col = 0; col < MONTH_VIEW_COL_COUNT; col++) {
      data[row].push(addMonths(viewDate, index++))
    }
  }

  return data
}

export function moveInMonthView(date: Date, action: CalendarNavigationAction) {
  switch (action) {
    case CalendarNavigationAction.NextCell:
      return addMonths(date, 1)

    case CalendarNavigationAction.PrevCell:
      return subMonths(date, 1)

    case CalendarNavigationAction.LowerCell:
      return addMonths(date, MONTH_VIEW_COL_COUNT)

    case CalendarNavigationAction.UpperCell:
      return subMonths(date, MONTH_VIEW_COL_COUNT)

    case CalendarNavigationAction.StartCell:
    case CalendarNavigationAction.FirstCell:
      return setMonth(date, 0)

    case CalendarNavigationAction.EndCell:
    case CalendarNavigationAction.LastCell:
      return setMonth(date, 11)

    case CalendarNavigationAction.PrevView:
      return subYears(date, 1)

    case CalendarNavigationAction.NextView:
      return addYears(date, 1)

    default:
      return date
  }
}

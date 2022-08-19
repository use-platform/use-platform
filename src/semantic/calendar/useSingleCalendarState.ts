import { useMemo, useState } from 'react'

import { isWeekend } from '../../internal/date'
import { useFirstDayOfWeek } from '../../libs/i18n'
import { clamp } from '../../libs/utils'
import { MAX_DATE, MIN_DATE } from './constants'
import {
  CalendarCellState,
  CalendarNavigationAction,
  CalendarView,
  CalendarViewKind,
  SingleCalendarProps,
  SingleCalendarState,
} from './types'
import {
  clampDate,
  closestViewDate,
  createRange,
  durationInViews,
  getViewDate,
  getViews,
  isEqualDate,
  isInRange,
  isSameCell,
  isSameView,
  move,
  nearest,
  startOfCell,
  startOfView,
  subViews,
} from './utils'

export type UseSingleCalendarStateProps = SingleCalendarProps

export type UseSingleCalendarStateResult = SingleCalendarState

export function useSingleCalendarState(
  props: UseSingleCalendarStateProps,
): UseSingleCalendarStateResult {
  const {
    value: propValue,
    defaultFocusedDate = propValue,
    onChange,
    autoFocus = false,
    readOnly = false,
    disabled = false,
    min: propMin = MIN_DATE,
    max: propMax = MAX_DATE,
    viewsCount = 1,
    minCalendarView = 'day',
    defaultCalendarView = minCalendarView,
    maxCalendarView = 'year',
  } = props
  const min = useMemo(() => new Date(propMin), [propMin])
  const max = useMemo(() => new Date(propMax), [propMax])
  const value = useMemo(() => (propValue ? new Date(propValue) : undefined), [propValue])
  const firstDayOfWeek = useFirstDayOfWeek()
  const [activeView, setActiveView] = useState(() => normalizeView(defaultCalendarView))
  const [isCalendarFocused, focusCalendar] = useState(autoFocus)
  const [focusedDate, setFocusedDate] = useState(() =>
    normalizeFocusedDate(defaultFocusedDate ? new Date(defaultFocusedDate) : new Date()),
  )
  const [baseDate, setBaseDate] = useState(() => normalizeBaseDate(activeView, focusedDate))

  function normalizeFocusedDate(date: Date) {
    return startOfCell(minCalendarView, clampDate(date, min, max))
  }

  function normalizeBaseDate(view: CalendarView, date: Date) {
    const maxDate = subViews(view, max, viewsCount - 1)
    const candidate = startOfView(view, clampDate(date, min, min > maxDate ? min : maxDate))

    return getViewDate(view, candidate, date)
  }

  function normalizeView(view: CalendarView) {
    const key = clamp(
      CalendarViewKind[view],
      CalendarViewKind[minCalendarView],
      CalendarViewKind[maxCalendarView],
    )

    return CalendarViewKind[key] as CalendarView
  }

  function moveView(view: CalendarView, offset: number = 0) {
    const key = CalendarViewKind[view] + offset
    const nextView = CalendarViewKind[key] as CalendarView | undefined

    return normalizeView(nextView ?? view)
  }

  function navigateTo(date: Date) {
    const nextBaseDate = getViewDate(activeView, date, focusedDate)

    if (isEqualDate(baseDate, nextBaseDate)) {
      return
    }

    setBaseDate(nextBaseDate)

    const nextFocusedDate = normalizeFocusedDate(
      nearest(activeView, focusedDate, nextBaseDate, viewsCount),
    )

    if (isEqualDate(focusedDate, nextFocusedDate)) {
      return
    }

    setFocusedDate(nextFocusedDate)
  }

  function focusTo(view: CalendarView, date: Date) {
    const nextFocusedDate = clampDate(startOfCell(minCalendarView, date), min, max)

    if (isEqualDate(focusedDate, nextFocusedDate)) {
      return
    }

    setFocusedDate(nextFocusedDate)

    const nextBaseDate = getViewDate(
      view,
      closestViewDate(view, baseDate, viewsCount, nextFocusedDate),
      nextFocusedDate,
    )

    if (isEqualDate(baseDate, nextBaseDate)) {
      return
    }

    setBaseDate(nextBaseDate)
  }

  function setViewAndFocusedDate(view: CalendarView, date: Date) {
    if (
      CalendarViewKind[view] < CalendarViewKind[minCalendarView] ||
      CalendarViewKind[view] > CalendarViewKind[maxCalendarView]
    ) {
      return
    }

    if (view !== activeView) {
      setActiveView(view)
    }

    const nextFocusedDate = normalizeFocusedDate(date)
    if (!isEqualDate(focusedDate, nextFocusedDate)) {
      setFocusedDate(nextFocusedDate)
    }

    const offset = durationInViews(
      activeView,
      baseDate,
      normalizeBaseDate(activeView, nextFocusedDate),
    )
    const nextBaseDate = subViews(view, normalizeBaseDate(view, nextFocusedDate), offset)
    if (!isEqualDate(baseDate, nextBaseDate)) {
      setBaseDate(nextBaseDate)
    }
  }

  function setView(view: CalendarView) {
    setViewAndFocusedDate(view, focusedDate)
  }

  function focusDate(date: Date) {
    focusTo(activeView, date)
  }

  function selectDate(date: Date) {
    if (readOnly || disabled || !isInRange(activeView, date, createRange(min, max))) {
      return
    }

    const nextView = moveView(activeView, -1)

    if (nextView !== activeView) {
      setViewAndFocusedDate(nextView, date)
    } else {
      focusTo(nextView, date)

      if (!readOnly && nextView === minCalendarView) {
        onChange?.({ value: date })
      }
    }
  }

  function getCellState(cellValue: Date, viewDate: Date) {
    const today = new Date()

    const sameView = isSameView(activeView, cellValue, viewDate)
    const isDisabled = disabled || !isInRange(activeView, cellValue, createRange(min, max))
    const isFocused = sameView && isSameCell(activeView, cellValue, focusedDate)
    const isSelected = value ? isSameCell(activeView, cellValue, value) : false
    const isToday = isSameCell(activeView, cellValue, today)

    const cellState: CalendarCellState = {
      isDisabled,
      isFocused,
      isSameView: sameView,
      isSelected,
      isToday,
      isWeekend: activeView === 'day' && isWeekend(cellValue),
    }

    return cellState
  }

  function moveDate(date: Date, action: CalendarNavigationAction) {
    return move(activeView, date, action, { firstDayOfWeek })
  }

  function canNavigateTo(date: Date) {
    const minViewDate = startOfView(activeView, min)
    const maxViewDate = new Date(
      Math.max(
        minViewDate.getTime(),
        startOfView(activeView, subViews(activeView, max, viewsCount - 1)).getTime(),
      ),
    )

    return isInRange(activeView, date, createRange(minViewDate, maxViewDate))
  }

  const views = useMemo(() => {
    return getViews(activeView, baseDate, viewsCount, { firstDayOfWeek })
  }, [baseDate, viewsCount, activeView, firstDayOfWeek])

  return {
    mode: 'single',
    value,
    isCalendarFocused,
    baseDate,
    focusedDate,
    activeView,
    views,
    focusCalendar,
    focusDate,
    selectDate,
    getCellState,
    moveDate,
    setView,
    canNavigateTo,
    navigateTo,
    moveView,
  }
}

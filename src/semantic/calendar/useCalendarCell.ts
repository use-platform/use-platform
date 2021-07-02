import { HTMLAttributes, RefObject, useEffect } from 'react'

import { SharedCalendarCellProps } from '../../shared/types'
import { usePress } from '../../interactions/press'
import { CalendarState, CalendarCellState } from './types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseCalendarCellProps extends SharedCalendarCellProps {}

export interface UseCalendarCellResult {
  cellState: CalendarCellState
  cellProps: HTMLAttributes<HTMLElement>
  buttonProps: HTMLAttributes<HTMLElement>
}

export function useCalendarCell(
  props: UseCalendarCellProps,
  state: CalendarState,
  ref: RefObject<HTMLElement>,
): UseCalendarCellResult {
  const { value, viewDate } = props
  const { calendarFocused, activeView, getCellState, highlightDate, focusDate, selectDate } = state
  const cellState = getCellState(value, viewDate)
  const { isSelected, isDisabled, isFocused, isSameView, isToday } = cellState
  const shouldBeFocused = calendarFocused && isFocused

  const { pressProps } = usePress({
    disabled: isDisabled,
    onPress: () => {
      focusDate(value)
      selectDate(value)
    },
  })

  useEffect(() => {
    if (shouldBeFocused && ref.current) {
      ref.current.focus()
    }
  }, [shouldBeFocused, ref])

  const onMouseEnter = () => {
    highlightDate(value)
  }

  const onFocus = () => {
    if (isSameView && !isFocused) {
      focusDate(value)
    }
  }

  const cellProps: HTMLAttributes<HTMLElement> = {
    role: 'gridcell',
  }

  const buttonProps: HTMLAttributes<HTMLElement> = {
    ...pressProps,
    role: 'button',
    'aria-selected': isSelected,
    'aria-disabled': isDisabled,
    'aria-hidden': !isSameView,
    // TODO: Set label for every view
    'aria-label': undefined,
  }

  if (!isDisabled) {
    buttonProps.tabIndex = isSameView && isFocused ? 0 : -1
    buttonProps.onFocus = onFocus
    buttonProps.onMouseEnter = onMouseEnter
  }

  if (isToday && activeView === 'day') {
    // NOTE: Usage only for day view
    buttonProps['aria-current'] = 'date'
  }

  return {
    cellState,
    cellProps,
    buttonProps,
  }
}

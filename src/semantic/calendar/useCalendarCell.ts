import { HTMLAttributes, RefObject, useEffect } from 'react'

import { usePress } from '../../interactions/press'
import { CalendarCellState, CalendarState } from './types'

export interface UseCalendarCellProps {
  /**
   * The cell value.
   */
  value: Date

  /**
   * The value of the current view.
   */
  viewDate: Date
}

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
  const { isCalendarFocused, activeView, getCellState, focusDate, selectDate } = state
  const cellState = getCellState(value, viewDate)
  const { isSelected, isDisabled, isFocused, isSameView, isToday } = cellState
  const shouldBeFocused = isCalendarFocused && isFocused
  const highlightDate = state.mode === 'range' ? state.highlightDate : null

  const { pressProps } = usePress({
    disabled: isDisabled,
    onPress: () => {
      selectDate(value)
    },
  })

  useEffect(() => {
    if (shouldBeFocused && ref.current) {
      ref.current.focus()
    }
  }, [shouldBeFocused, ref])

  const onMouseEnter = () => {
    highlightDate?.(value)
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
  }

  if (state.mode === 'range' && !isDisabled) {
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

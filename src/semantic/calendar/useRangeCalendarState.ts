import { useState } from 'react'

import {
  CalendarCellState,
  RangeCalendarCellState,
  RangeCalendarProps,
  RangeCalendarState,
} from './types'
import { useSingleCalendarState } from './useSingleCalendarState'
import { createRange, isInRange, isSameCell, isSameView } from './utils'

export type UseRangeCalendarStateProps = RangeCalendarProps

export type UseRangeCalendarStateResult = RangeCalendarState

export function useRangeCalendarState(
  props: UseRangeCalendarStateProps,
): UseRangeCalendarStateResult {
  const { value, defaultValue, onChange, ...restProps } = props
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(null)

  const singleState = useSingleCalendarState({
    ...restProps,
    value: value?.start ?? undefined,
    onChange: (event) => {
      setHighlightedDate(highlightedDate ? null : event.value)

      onChange?.({ value: createRange(highlightedDate, event.value) })
    },
  })

  const { activeView, focusedDate, focusDate, getCellState: getBaseCellState } = singleState
  const highlightedRange = highlightedDate
    ? createRange(highlightedDate, focusedDate)
    : value && createRange(value.start, value.end)

  function highlightDate(date: Date) {
    if (highlightedDate) {
      focusDate(date)
    }
  }

  function getCellState(
    cellValue: Date,
    viewDate: Date,
  ): CalendarCellState & RangeCalendarCellState {
    const baseCellState = getBaseCellState(cellValue, viewDate)

    const isHighlighted = highlightedRange
      ? isInRange(activeView, cellValue, highlightedRange)
      : false
    const isHighlightedStart = highlightedRange?.start
      ? isSameCell(activeView, cellValue, highlightedRange.start)
      : false
    const isHighlightedEnd = highlightedRange?.end
      ? isSameCell(activeView, cellValue, highlightedRange.end)
      : false
    const hasHighlightDate = highlightedDate
      ? isSameCell(activeView, cellValue, highlightedDate)
      : false

    const isRangePreview = Boolean(highlightedDate) && isHighlighted
    const isSelectionStart = isRangePreview
      ? isHighlightedStart && hasHighlightDate
      : isHighlightedStart
    const isSelectionEnd = isRangePreview ? isHighlightedEnd && hasHighlightDate : isHighlightedEnd

    return {
      ...baseCellState,
      isDisabled: baseCellState.isDisabled || !isSameView(activeView, cellValue, viewDate),
      isRangePreview: Boolean(highlightedDate) && isHighlighted,
      isRangePreviewStart: isRangePreview && isHighlightedStart,
      isRangePreviewEnd: isRangePreview && isHighlightedEnd,
      isRangeSelected: !highlightedDate && isHighlighted,
      isSelectionStart: isRangePreview
        ? isHighlightedStart && hasHighlightDate
        : isHighlightedStart,
      isSelectionEnd: isRangePreview ? isHighlightedEnd && hasHighlightDate : isHighlightedEnd,
      isSelected: isSelectionStart || isSelectionEnd,
    }
  }

  return {
    ...singleState,
    mode: 'range',
    value,
    highlightDate,
    getCellState,
  }
}

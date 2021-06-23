import { MultipleCalendarProps, MultipleCalendarState } from './types'
import { isEqualDate, isSameCell } from './utils'
import { useSingleCalendarState } from './useSingleCalendarState'

export type UseMultipleCalendarStateProps = MultipleCalendarProps

export type UseMultipleCalendarStateResult = MultipleCalendarState

export function useMultipleCalendarState(
  props: UseMultipleCalendarStateProps,
): UseMultipleCalendarStateResult {
  const { value, defaultValue, onChange, ...restProps } = props

  const singleState = useSingleCalendarState({
    ...restProps,
    value: value?.[0],
    onChange: (date) => {
      const values = value?.slice() ?? []

      const index = values.findIndex((val) => isEqualDate(val, date))
      if (index !== -1) {
        values.splice(index, 1)
      } else {
        values.push(date)
      }

      onChange?.(values)
    },
  })

  function getCellState(cellValue: Date, viewDate: Date) {
    const baseCellState = singleState.getCellState(cellValue, viewDate)

    return {
      ...baseCellState,
      isSelected: value?.some((val) => isSameCell(singleState.activeView, val, cellValue)) ?? false,
    }
  }

  return {
    ...singleState,
    mode: 'multiple',
    value,
    getCellState,
  }
}

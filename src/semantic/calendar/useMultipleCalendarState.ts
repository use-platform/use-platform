import { MultipleCalendarProps, MultipleCalendarState } from './types'
import { useSingleCalendarState } from './useSingleCalendarState'
import { isEqualDate, isSameCell } from './utils'

export type UseMultipleCalendarStateProps = MultipleCalendarProps

export type UseMultipleCalendarStateResult = MultipleCalendarState

export function useMultipleCalendarState(
  props: UseMultipleCalendarStateProps,
): UseMultipleCalendarStateResult {
  const { value, defaultValue, onChange, ...restProps } = props

  const singleState = useSingleCalendarState({
    ...restProps,
    value: value?.[0],
    onChange: (event) => {
      const values = value?.slice() ?? []

      const index = values.findIndex((val) => isEqualDate(val, event.value))
      if (index !== -1) {
        values.splice(index, 1)
      } else {
        values.push(event.value)
      }

      onChange?.({ value: values })
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

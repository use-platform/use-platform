import { useState } from 'react'

import { getDateWithTime } from './utils'
import type { RangeMaybeDateValue, DateInputChangeEvent } from '../../shared/types'
import type { BaseDateRangePickerProps } from './types'

export interface UseDateRangePickerStateResult {
  value: RangeMaybeDateValue
  setValue: (event: DateInputChangeEvent<RangeMaybeDateValue>) => void
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

export function useDateRangePickerState(
  props: BaseDateRangePickerProps,
): UseDateRangePickerStateResult {
  const { onChange, value = { start: null, end: null } } = props
  const [isOpen, setOpen] = useState(false)

  function handleSetValue(event: DateInputChangeEvent<RangeMaybeDateValue>) {
    if (isOpen) {
      setOpen(false)
    }

    if (event.value.start && value.start) {
      event.value.start = getDateWithTime(event.value.start, value.start)
    }
    if (event.value.end && value.end) {
      event.value.end = getDateWithTime(event.value.end, value.end)
    }

    onChange?.({ value: event.value })
  }

  return {
    value,
    setValue: handleSetValue,
    isOpen,
    setOpen,
  }
}

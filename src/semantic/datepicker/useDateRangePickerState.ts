import { useState } from 'react'

import { getDateWithTime } from './utils'
import type { DateRangeValue, DateInputChangeEvent } from '../../shared/types'
import type { BaseDateRangePickerProps, UseDatePickerStateResult } from './types'

export function useDateRangePickerState(
  props: BaseDateRangePickerProps,
): UseDatePickerStateResult<DateRangeValue> {
  const { onChange, value = { start: null, end: null } } = props
  const [isOpen, setOpen] = useState(false)

  function handleSetValue(event: DateInputChangeEvent<DateRangeValue>) {
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
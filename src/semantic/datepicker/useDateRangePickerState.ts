import { useState } from 'react'

import type { DateInputChangeEvent, DateRangeValue } from '../../shared/types'
import type { BaseDateRangePickerProps, UseDatePickerStateResult } from './types'
import { getDateWithTime } from './utils'

export function useDateRangePickerState(
  props: BaseDateRangePickerProps,
): UseDatePickerStateResult<DateRangeValue> {
  const { onChange, value = { start: null, end: null } } = props
  const [isOpen, setOpen] = useState(false)

  function handleSetValue(event: DateInputChangeEvent<DateRangeValue>) {
    if (isOpen && event.value.start && event.value.end) {
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

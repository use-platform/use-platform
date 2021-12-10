import { useMemo, useState } from 'react'

import type { DateInputChangeEvent } from '../../shared/types'
import type { BaseDatePickerProps, UseDatePickerStateResult } from './types'
import { getDateWithTime } from './utils'

export function useDatePickerState(
  props: BaseDatePickerProps,
): UseDatePickerStateResult<Date | null> {
  const { onChange, value: propValue = null } = props
  const value = useMemo(() => (propValue ? new Date(propValue) : null), [propValue])
  const [isOpen, setOpen] = useState(false)

  function handleSetValue(event: DateInputChangeEvent<Date | null>) {
    if (isOpen) {
      setOpen(false)
    }

    if (event.value && value) {
      event.value = getDateWithTime(event.value, value)
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

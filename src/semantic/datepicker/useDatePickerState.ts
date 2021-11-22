import { useState } from 'react'

import type { DateInputChangeEvent, MaybeDateValue } from '../../shared/types'
import type { BaseDatePickerProps, UseDatePickerStateResult } from './types'
import { getDateWithTime } from './utils'

export function useDatePickerState(
  props: BaseDatePickerProps,
): UseDatePickerStateResult<MaybeDateValue> {
  const { onChange, value = null } = props
  const [isOpen, setOpen] = useState(false)

  function handleSetValue(event: DateInputChangeEvent<MaybeDateValue>) {
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

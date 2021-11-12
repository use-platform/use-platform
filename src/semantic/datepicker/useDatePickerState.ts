import { useState } from 'react'

import { getDateWithTime } from './utils'
import type { MaybeDateValue, DateInputChangeEvent } from '../../shared/types'
import type { BaseDatePickerProps } from './types'

export interface UseDatePickerStateResult {
  value: MaybeDateValue
  setValue: (event: DateInputChangeEvent<MaybeDateValue>) => void
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

export function useDatePickerState(props: BaseDatePickerProps): UseDatePickerStateResult {
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

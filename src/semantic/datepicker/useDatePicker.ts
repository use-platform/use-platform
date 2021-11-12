import { KeyboardEvent } from 'react'

import type { UseDatePickerStateResult } from './useDatePickerState'
import type { UseDateRangePickerStateResult } from './useDateRangePickerState'

export interface UseDatePickerProps {
  disabled?: boolean
  readOnly?: boolean
}

export function useDatePicker(
  props: UseDatePickerProps,
  state: UseDatePickerStateResult | UseDateRangePickerStateResult,
) {
  const { disabled, readOnly } = props

  const onKeyDown = (event: KeyboardEvent) => {
    if (disabled || readOnly) {
      return
    }

    if (event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      state.setOpen(true)
    }
  }

  const onPress = () => {
    state.setOpen(!state.isOpen)
  }

  return {
    groupProps: {
      role: 'group',
      onKeyDown,
    },
    triggerProps: {
      tabIndex: -1,
      onPress,
    },
  }
}

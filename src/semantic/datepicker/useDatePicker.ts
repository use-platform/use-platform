import type { HTMLAttributes, KeyboardEvent } from 'react'

import type { DateRangeValue } from '../../shared/types'
import type { ButtonBaseProps } from '../button'
import type { UseDatePickerStateResult } from './types'

export interface UseDatePickerProps {
  disabled?: boolean
  readOnly?: boolean
}

export interface UseDatePickerResult {
  groupProps: HTMLAttributes<HTMLElement>
  triggerProps: ButtonBaseProps
}

export function useDatePicker(
  props: UseDatePickerProps,
  state: UseDatePickerStateResult<Date | DateRangeValue | null>,
): UseDatePickerResult {
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

import { HTMLAttributes } from 'react'

import type { UseRadioGroupProps } from './types'

export interface UseRadioGroupResult {
  rootProps: HTMLAttributes<HTMLElement>
}

export function useRadioGroup(props: UseRadioGroupProps): UseRadioGroupResult {
  const { disabled, readOnly } = props

  return {
    rootProps: {
      role: 'radiogroup',
      'aria-disabled': disabled,
      'aria-readonly': readOnly,
    },
  }
}

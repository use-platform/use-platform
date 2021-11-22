import { HTMLAttributes } from 'react'

import type { UseRadioGroupProps } from './types'

export interface UseRadioGroupResult {
  rootProps: HTMLAttributes<HTMLElement>
}

export function useRadioGroup(props: UseRadioGroupProps): UseRadioGroupResult {
  const { onChange, disabled, readOnly, ...restProps } = props

  return {
    rootProps: {
      ...restProps,
      role: 'radiogroup',
      'aria-disabled': disabled,
      'aria-readonly': readOnly,
    },
  }
}

import { HTMLAttributes } from 'react'

import { mergeProps } from '../../libs/merge-props'
import type { UseRadioGroupProps } from './types'

export interface UseRadioGroupResult {
  rootProps: HTMLAttributes<HTMLElement>
}

export function useRadioGroup(props: UseRadioGroupProps): UseRadioGroupResult {
  const { onChange, disabled, readOnly, ...restProps } = props

  return {
    rootProps: mergeProps(restProps, {
      role: 'radiogroup',
      'aria-disabled': disabled,
      'aria-readonly': readOnly,
    }),
  }
}

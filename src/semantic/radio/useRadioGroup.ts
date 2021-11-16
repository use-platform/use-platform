import { HTMLAttributes } from 'react'
import { mergeProps } from '../../libs/merge-props'
import type { UseRadioGroupProps } from './types'

export interface UseRadioGroupResult {
  rootProps: HTMLAttributes<HTMLElement>
}

export function useRadioGroup(props: UseRadioGroupProps): UseRadioGroupResult {
  return {
    rootProps: mergeProps(props, { role: 'radiogroup' }),
  }
}

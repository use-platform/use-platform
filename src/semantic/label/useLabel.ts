import { HTMLAttributes, LabelHTMLAttributes } from 'react'

import { useUniqId } from '../../libs/uniq-id'
import { BaseLabelProps } from './types'

export interface UseLabelResult {
  labelProps: LabelHTMLAttributes<HTMLElement>
  fieldProps: HTMLAttributes<HTMLElement>
}

export function useLabel(props: BaseLabelProps): UseLabelResult {
  const labelId = useUniqId()
  const fieldId = useUniqId(props.id)

  return {
    labelProps: {
      id: labelId,
      htmlFor: props.behavior === 'label' ? fieldId : undefined,
    },
    fieldProps: {
      'aria-labelledby': labelId,
      id: fieldId,
    },
  }
}

import { ChangeEventHandler } from 'react'

import { useUniqId } from '../../libs/uniq-id'
import type { InputBaseProps, InputValueProps } from '../../shared/types'

export interface UseRadioGroupStateResult {
  name: string
  selectedValue?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  setSelectedValue?: ChangeEventHandler<HTMLInputElement>
}

export interface UseRadioGroupStateProps extends InputBaseProps, InputValueProps<string> {}

export function useRadioGroupState(props: UseRadioGroupStateProps): UseRadioGroupStateResult {
  const { disabled, readOnly, name, value, onChange } = props
  const groupName = useUniqId(name)

  return {
    isDisabled: disabled,
    name: groupName,
    isReadOnly: readOnly,
    selectedValue: value,
    setSelectedValue: onChange,
  }
}

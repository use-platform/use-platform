import { ChangeEventHandler } from 'react'

import type { InputBaseProps, InputValueProps } from '../../shared/types/input'
import { useUniqId } from '../../libs/uniq-id'

export interface UseRadioGroupStateResult {
  name: string
  selectedValue?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  setSelectedValue?: ChangeEventHandler<HTMLInputElement>
}

export interface UseRadioGroupStateProps extends InputBaseProps, InputValueProps<string> {}

export function useRadioGroupState(props: UseRadioGroupStateProps): UseRadioGroupStateResult {
  const { disabled, readOnly } = props
  let { name, onChange: setSelectedValue, value: selectedValue } = props
  name = useUniqId(name)
  return {
    isDisabled: disabled,
    name,
    isReadOnly: readOnly,
    selectedValue,
    setSelectedValue,
  }
}

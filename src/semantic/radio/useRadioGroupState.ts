import type { InputBaseProps, InputValueProps } from '../../shared/types/input'
import { useState } from 'react'
import { useUniqId } from '../../libs/uniq-id'

export interface UseRadioGroupStateResult {
  name: string
  selectedValue?: string
  disabled?: boolean
  readOnly?: boolean
  setValue: (value: string | undefined) => void
}

export interface UseRadioGroupStateProps extends InputBaseProps, InputValueProps<string> {}

export function useRadioGroupState(props: UseRadioGroupStateProps): UseRadioGroupStateResult {
  const [selectedValue, setValue] = useState<string | undefined>(props.value || props.defaultValue)
  const { disabled, readOnly } = props
  let { name } = props
  name = useUniqId(name)
  return {
    disabled,
    name,
    readOnly,
    selectedValue,
    setValue,
  }
}

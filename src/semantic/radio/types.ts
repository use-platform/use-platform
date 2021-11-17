import type { ChangeEventHandler } from 'react'

import type {
  FocusableDOMProps,
  InputBaseProps,
  InputValueProps,
  ValidationProps,
} from '../../shared/types'

export interface UseRadioGroupProps extends InputBaseProps, InputValueProps<string> {}

export interface RadioProps extends InputBaseProps, FocusableDOMProps, ValidationProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  value?: string
}

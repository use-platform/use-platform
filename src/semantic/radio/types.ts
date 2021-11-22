import type {
  FocusableDOMProps,
  InputBaseProps,
  InputValueProps,
  ValidationProps,
} from '../../shared/types'

export interface UseRadioGroupProps extends InputBaseProps, InputValueProps<string> {}

export interface BaseRadioProps
  extends InputBaseProps,
    FocusableDOMProps,
    ValidationProps,
    InputValueProps<string> {
  checked?: boolean
  defaultChecked?: boolean
}

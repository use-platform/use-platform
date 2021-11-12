import type {
  DateInputValueProps,
  DateValue,
  InputBaseProps,
  FocusableDOMProps,
  MaybeDateValue,
  DateRangeValue,
} from '../../shared/types'

export interface SharedDatePickerProps extends InputBaseProps, FocusableDOMProps {
  min?: DateValue
  max?: DateValue
}

export type BaseDatePickerProps = SharedDatePickerProps & DateInputValueProps<MaybeDateValue>
export type BaseDateRangePickerProps = SharedDatePickerProps & DateInputValueProps<DateRangeValue>

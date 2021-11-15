import type {
  DateInputValueProps,
  DateValue,
  InputBaseProps,
  FocusableDOMProps,
  MaybeDateValue,
  DateRangeValue,
  DateInputChangeEvent,
} from '../../shared/types'

export interface SharedDatePickerProps extends InputBaseProps, FocusableDOMProps {
  min?: DateValue
  max?: DateValue
}

export type BaseDatePickerProps = SharedDatePickerProps & DateInputValueProps<MaybeDateValue>
export type BaseDateRangePickerProps = SharedDatePickerProps & DateInputValueProps<DateRangeValue>

export interface UseDatePickerStateResult<T> {
  value: T
  setValue: (event: DateInputChangeEvent<T>) => void
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

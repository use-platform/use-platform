import { ChangeEventHandler } from 'react'

export type ValidationState = 'valid' | 'invalid'

export interface ValidationProps {
  state?: ValidationState
  required?: boolean
}

export interface InputBaseProps {
  disabled?: boolean
  name?: string
  readOnly?: boolean
}

export interface InputValueProps<T> {
  defaultValue?: T
  onChange?: ChangeEventHandler<HTMLInputElement>
  value?: T
}

export type DateLike = Date | number

export interface DateInputChangeEvent<T> {
  value: T
}

export interface DateInputValueProps<T> {
  defaultValue?: T
  onChange?: (event: DateInputChangeEvent<T>) => void
  value?: T
}

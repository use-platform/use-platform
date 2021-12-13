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

export interface DateInputChangeEvent<T> {
  value: T
}

export interface DateInputValueProps<T, V = T> {
  defaultValue?: T
  onChange?: (event: DateInputChangeEvent<V>) => void
  value?: T
}

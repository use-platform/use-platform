import { ChangeEventHandler } from 'react'

export type ValidationState = 'valid' | 'invalid'

export interface ValidationProps {
  state?: ValidationState
  required?: boolean
}

export interface InputBaseProps {
  disabled?: boolean
  readOnly?: boolean
}

export interface ValueProps<T> {
  defaultValue?: T
  onChange?: ChangeEventHandler<HTMLInputElement>
  value?: T
}

import { ChangeEventHandler } from 'react'

import { AriaLabelingProps, AriaValidationProps, FocusableDOMProps } from './dom'

export type ValidationState2 = 'valid' | 'invalid'

// TODO: In future separate the types for semantic interfaces.
export interface SharedToggleProps
  extends FocusableDOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  'aria-controls'?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  readOnly?: boolean
  required?: boolean
  // TODO: Maybe use invalid as boolean instead union.
  state?: ValidationState2
  value?: string
}

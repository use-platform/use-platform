import type { ChangeEventHandler } from 'react'

import type { FocusableDOMProps, InputBaseProps, ValidationProps } from '../../shared/types'

export interface ToggleBaseProps extends InputBaseProps, FocusableDOMProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  value?: string
}

export interface CommonToggleProps extends ToggleBaseProps, ValidationProps {}

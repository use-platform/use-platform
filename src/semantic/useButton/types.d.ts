import { ReactNode } from 'react'

import type { PressProps } from '../../shared/usePress'
import type { FocusableDOMProps } from '../../shared/types'

export interface ButtonBaseProps extends PressProps, FocusableDOMProps {
  children?: ReactNode
  disabled?: boolean
}

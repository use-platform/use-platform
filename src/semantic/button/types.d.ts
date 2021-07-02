import type { ReactNode } from 'react'

import type { PressProps } from '../../interactions/press'
import type { FocusableDOMProps } from '../../shared/types'

export interface ButtonBaseProps extends PressProps, FocusableDOMProps {
  children?: ReactNode
  disabled?: boolean
}

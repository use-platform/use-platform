import { ReactNode } from 'react'

import type { FocusableDOMProps } from './dom'
import type { ElementTypeProps } from './element'
import type { PressEventProps } from './events'

export interface SharedButtonProps extends ElementTypeProps, PressEventProps, FocusableDOMProps {
  children?: ReactNode
  disabled?: boolean
  href?: string
  rel?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

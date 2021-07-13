import { ReactNode } from 'react'

import type { FocusableDOMProps } from './dom'
import type { ElementTypeProps } from './element'
import type { PressEventProps } from './events'

export interface SharedButtonProps<T = HTMLElement>
  extends ElementTypeProps,
    PressEventProps<T>,
    FocusableDOMProps {
  children?: ReactNode
  disabled?: boolean
  href?: string
  rel?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

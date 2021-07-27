import { ReactNode } from 'react'

import type { PressProps } from '../../interactions/press'
import type { FocusableDOMProps } from './dom'
import type { ElementTypeProps } from './element'

export interface SharedButtonProps<T = HTMLElement>
  extends ElementTypeProps,
    PressProps<T>,
    FocusableDOMProps {
  children?: ReactNode
  disabled?: boolean
  href?: string
  rel?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

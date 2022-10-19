import { ReactNode } from 'react'

import type { PressProps } from '../../interactions/press'
import type { FocusableDOMProps } from './dom'

export interface SharedButtonProps<T = HTMLElement> extends PressProps<T>, FocusableDOMProps {
  children?: ReactNode
  disabled?: boolean
  href?: string
  rel?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed'
  'aria-haspopup'?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-expanded'?: boolean | 'true' | 'false'
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-controls'?: string
}

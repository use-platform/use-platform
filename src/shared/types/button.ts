import { ReactNode } from 'react'

import type { ElementTypeProps } from './element'

export interface SharedButtonProps extends ElementTypeProps {
  children?: ReactNode
  disabled?: boolean
  href?: string
  rel?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

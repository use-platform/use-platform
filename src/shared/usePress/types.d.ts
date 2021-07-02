import type { PressEventProps } from '../types'

export interface PressProps extends PressEventProps {
  disabled?: boolean
  preventFocusOnPress?: boolean
}

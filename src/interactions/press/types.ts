import type { PressEventProps } from '../../shared/types'

export interface PressProps extends PressEventProps {
  disabled?: boolean
  preventFocusOnPress?: boolean
}

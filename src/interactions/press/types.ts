import type { PressEventProps } from '../../shared/types'

export interface PressProps<T = HTMLElement> extends PressEventProps<T> {
  disabled?: boolean
  preventFocusOnPress?: boolean
}

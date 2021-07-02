import type {
  DOMProps,
  ElementTypeProps,
  FocusableDOMProps,
  FocusEventProps,
  InputBaseProps,
  KeyboardEventProps,
  ValidationProps,
  ValueProps,
} from '../../shared/types'

export interface TextFieldBaseProps
  extends InputBaseProps,
    ValueProps<string | number>,
    DOMProps,
    FocusableDOMProps,
    KeyboardEventProps,
    FocusEventProps {
  autoComplete?: string
  maxLength?: number
  minLength?: number
  name?: string
  pattern?: string
  placeholder?: string
  type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password' | string
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  min?: number | string
  max?: number | string
}

export interface CommonTextFieldProps
  extends TextFieldBaseProps,
    ValidationProps,
    ElementTypeProps {
  'aria-activedescendant'?: string
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
}

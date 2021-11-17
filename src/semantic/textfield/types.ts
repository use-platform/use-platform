import type {
  DOMProps,
  ElementTypeProps,
  FocusEventProps,
  FocusableDOMProps,
  InputBaseProps,
  InputValueProps,
  KeyboardEventProps,
  ValidationProps,
} from '../../shared/types'

export interface TextFieldBaseProps
  extends InputBaseProps,
    InputValueProps<string | number>,
    DOMProps,
    FocusableDOMProps,
    KeyboardEventProps,
    FocusEventProps {
  autoComplete?: string
  maxLength?: number
  minLength?: number
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

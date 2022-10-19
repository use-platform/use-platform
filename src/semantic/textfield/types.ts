import type {
  DOMProps,
  FocusEventProps,
  FocusableDOMProps,
  InputBaseProps,
  InputValueProps,
  ValidationProps,
} from '../../shared/types'

export interface TextFieldBaseProps
  extends InputBaseProps,
    InputValueProps<string | ReadonlyArray<string> | number>,
    DOMProps,
    FocusableDOMProps,
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

export interface CommonTextFieldProps extends TextFieldBaseProps, ValidationProps {
  'aria-activedescendant'?: string
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-multiline'?: boolean | 'true' | 'false'
  'aria-placeholder'?: string
  'aria-readonly'?: boolean | 'true' | 'false'
  'aria-required'?: boolean | 'true' | 'false'
}

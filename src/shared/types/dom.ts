export interface DOMProps {
  id?: string
  className?: string
}

export interface FocusableDOMProps {
  autoFocus?: boolean
  tabIndex?: number
}

export interface AriaLabelingProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-details'?: string
}

export interface AriaValidationProps {
  'aria-errormessage'?: string
}

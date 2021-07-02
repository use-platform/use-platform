import { HTMLAttributes, InputHTMLAttributes, RefObject, useEffect } from 'react'

import { useToggle } from '../toggle'
import { CommonCheckboxProps } from './types'

export interface UseCheckboxResult {
  pressed: boolean
  hovered: boolean
  rootProps: HTMLAttributes<HTMLElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export function useCheckbox<T extends HTMLInputElement = HTMLInputElement>(
  props: CommonCheckboxProps,
  ref: RefObject<T>,
): UseCheckboxResult {
  const { indeterminate = false, ...restProps } = props
  const toggle = useToggle(restProps, ref)

  // Use effect for apply state after component render.
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  })

  return {
    ...toggle,
    inputProps: {
      ...toggle.inputProps,
      'aria-checked': indeterminate ? 'mixed' : toggle.inputProps.checked,
    },
  }
}

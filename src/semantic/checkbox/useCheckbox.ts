import { HTMLAttributes, InputHTMLAttributes, RefObject, useEffect } from 'react'

import { SharedCheckboxProps } from '../../shared/types'
import { useToggle } from '../toggle'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseCheckboxProps extends SharedCheckboxProps {}

export interface UseCheckboxResult {
  pressed: boolean
  hovered: boolean
  rootProps: HTMLAttributes<HTMLElement>
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export function useCheckbox<T extends HTMLInputElement = HTMLInputElement>(
  props: UseCheckboxProps,
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

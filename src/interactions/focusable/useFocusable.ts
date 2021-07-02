import { HTMLAttributes, RefObject, useEffect } from 'react'

import { focusElement } from '../../libs/dom-utils'
import type { FocusableDOMProps } from '../../shared/types'

export interface UseFocusableProps extends FocusableDOMProps {
  disabled?: boolean
}

export interface UseFocusableResult<T> {
  focusableProps: HTMLAttributes<T>
}

export function useFocusable<T extends HTMLElement = HTMLElement>(
  props: UseFocusableProps,
  ref: RefObject<T>,
): UseFocusableResult<T> {
  const { autoFocus, disabled, tabIndex } = props

  useEffect(() => {
    if (autoFocus) {
      focusElement(ref.current)
    }
  }, [autoFocus, ref])

  return {
    focusableProps: {
      tabIndex: disabled ? -1 : tabIndex,
    },
  }
}

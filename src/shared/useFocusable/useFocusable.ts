import { HTMLAttributes, RefObject, useEffect } from 'react'

import { focusElement } from '../../libs/dom-utils'
import type { FocusableProps } from '../types'

interface UseFocusableProps extends FocusableProps {
  disabled?: boolean
}

interface UseFocusableResult<T> {
  focusableProps: HTMLAttributes<T>
}

export function useFocusable<T extends HTMLElement = HTMLElement>(
  props: UseFocusableProps,
  ref: RefObject<T>,
): UseFocusableResult<T> {
  const { autoFocus, disabled } = props

  useEffect(() => {
    if (autoFocus) {
      focusElement(ref.current)
    }
  }, [autoFocus, ref])

  return {
    focusableProps: {
      tabIndex: disabled ? -1 : undefined,
    },
  }
}

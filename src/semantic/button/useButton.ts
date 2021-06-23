import { RefObject, ElementType, HTMLAttributes, AllHTMLAttributes } from 'react'

import { isFirefox } from '../../libs/platform'
import { mergeProps } from '../../libs/merge-props'
import { usePress } from '../../interactions/press'
import { useFocusable } from '../../interactions/focusable'
import type { SharedButtonProps } from '../../shared/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseButtonProps extends SharedButtonProps {}

export interface UseButtonResult<T> {
  isPressed: boolean
  buttonProps: HTMLAttributes<T>
  ElementType: ElementType
}

export function useButton<T extends HTMLElement = HTMLElement>(
  props: UseButtonProps,
  ref: RefObject<T>,
): UseButtonResult<T> {
  const {
    as: elementType = 'button',
    disabled,
    href,
    target,
    rel,
    type = 'button',
    tabIndex,
    ...restProps
  } = props

  let additionalProps: AllHTMLAttributes<T>

  if (elementType === 'button') {
    additionalProps = { type, disabled }

    if (isFirefox()) {
      // https://bugzilla.mozilla.org/show_bug.cgi?id=654072
      additionalProps.autoComplete = 'off'
    }
  } else {
    additionalProps = {
      role: 'button',
      tabIndex: disabled ? undefined : 0,
      href: elementType === 'a' && disabled ? undefined : href,
      target: elementType === 'a' ? target : undefined,
      type: elementType === 'input' ? type : undefined,
      disabled: elementType === 'input' ? disabled : undefined,
      'aria-disabled': !disabled || elementType === 'input' ? undefined : disabled,
      rel: elementType === 'a' ? rel : undefined,
    }
  }

  const { focusableProps } = useFocusable(props, ref)
  const { isPressed, pressProps } = usePress(props)

  return {
    buttonProps: mergeProps(restProps, additionalProps, focusableProps, pressProps),
    ElementType: elementType,
    isPressed,
  }
}
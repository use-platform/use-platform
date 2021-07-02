import { RefObject, ElementType, HTMLAttributes, AllHTMLAttributes } from 'react'

import { isFirefox } from '../../libs/platform'
import { mergeProps } from '../../libs/merge-props'
import { useHover } from '../../shared/useHover'
import { usePress } from '../../shared/usePress'
import { useFocusable } from '../../shared/useFocusable'
import type { SharedButtonProps } from '../../shared/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseButtonProps extends SharedButtonProps {}

export interface UseButtonResult<T> {
  hovered: boolean
  pressed: boolean
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
  const { pressed, pressProps } = usePress(props)
  const { isHovered: hovered, hoverProps } = useHover(props)

  const buttonProps = mergeProps(restProps, additionalProps, focusableProps, pressProps, hoverProps)

  return {
    ElementType: elementType,
    pressed,
    hovered,
    buttonProps,
  }
}

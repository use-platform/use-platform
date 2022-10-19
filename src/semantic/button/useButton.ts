import { AllHTMLAttributes, ElementType, HTMLAttributes, RefObject } from 'react'

import { useFocusable } from '../../interactions/focusable'
import { usePress } from '../../interactions/press'
import { mergeProps } from '../../libs/merge-props'
import { isFirefox } from '../../libs/platform'
import type { SharedButtonProps } from '../../shared/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseButtonProps<T extends HTMLElement = HTMLElement> extends SharedButtonProps<T> {
  elementType?: Extract<ElementType, string>
}

export interface UseButtonResult<T> {
  isPressed: boolean
  buttonProps: HTMLAttributes<T>
}

export function useButton<T extends HTMLElement = HTMLElement>(
  props: UseButtonProps<T>,
  ref: RefObject<T>,
): UseButtonResult<T> {
  const {
    elementType = 'button',
    disabled,
    href,
    target,
    rel,
    type = 'button',
    tabIndex,
    onPress: _onPress,
    onPressEnd: _onPressEnd,
    onPressStart: _onPressStart,
    onPressUp: _onPressUp,
    preventFocusOnPress: _preventFocusOnPress,
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
      'aria-disabled': disabled ? disabled : undefined,
      role: 'button',
      tabIndex: tabIndex || 0,
    }

    if (elementType === 'a') {
      additionalProps.href = disabled ? undefined : href
      additionalProps.rel = rel
      additionalProps.target = target
    }
  }

  const { focusableProps } = useFocusable(props, ref)
  const { isPressed, pressProps } = usePress(props)

  return {
    buttonProps: mergeProps(additionalProps, focusableProps, pressProps, {
      'aria-pressed': props['aria-pressed'],
      'aria-haspopup': props['aria-haspopup'],
      'aria-controls': props['aria-controls'],
      'aria-expanded': props['aria-expanded'],
      'aria-label': props['aria-label'],
      'aria-labelledby': props['aria-labelledby'],
    }),
    isPressed,
  }
}

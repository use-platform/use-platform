import { FocusEvent, HTMLAttributes, KeyboardEvent } from 'react'

import { useLocale } from '../../libs/i18n'
import { CalendarNavigationAction, CalendarState } from './types'

export interface UseCalendarProps {
  readOnly?: boolean
  disabled?: boolean
}

export interface UseCalendarResult {
  gridProps: HTMLAttributes<HTMLElement>
}

export function useCalendar(props: UseCalendarProps, state: CalendarState): UseCalendarResult {
  const { readOnly, disabled } = props
  const { mode, focusedDate, focusCalendar, focusDate, moveDate } = state
  const { isRTL } = useLocale()

  const onFocus = () => {
    focusCalendar(true)
  }

  const onBlur = (event: FocusEvent) => {
    const { relatedTarget, currentTarget } = event

    if (!currentTarget.contains(relatedTarget as HTMLElement)) {
      focusCalendar(false)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    let action: CalendarNavigationAction | null = null

    switch (event.key) {
      case 'ArrowLeft':
        action = isRTL ? CalendarNavigationAction.NextCell : CalendarNavigationAction.PrevCell
        break

      case 'ArrowRight':
        action = isRTL ? CalendarNavigationAction.PrevCell : CalendarNavigationAction.NextCell
        break

      case 'ArrowUp':
        action = CalendarNavigationAction.UpperCell
        break

      case 'ArrowDown':
        action = CalendarNavigationAction.LowerCell
        break

      case 'Home':
        action = event.shiftKey
          ? CalendarNavigationAction.FirstCell
          : CalendarNavigationAction.StartCell
        break

      case 'End':
        action = event.shiftKey
          ? CalendarNavigationAction.LastCell
          : CalendarNavigationAction.EndCell
        break

      case 'PageUp':
        action = event.shiftKey
          ? CalendarNavigationAction.PrevExtraView
          : CalendarNavigationAction.PrevView
        break

      case 'PageDown':
        action = event.shiftKey
          ? CalendarNavigationAction.NextExtraView
          : CalendarNavigationAction.NextView
        break
    }

    if (action !== null) {
      event.preventDefault()
      focusDate(moveDate(focusedDate, action))
    }
  }

  const gridProps: HTMLAttributes<HTMLElement> = {
    role: 'grid',
    'aria-readonly': readOnly,
    'aria-disabled': disabled,
    'aria-multiselectable': mode === 'multiple' || mode === 'range',
    onFocus,
    onBlur,
    onKeyDown,
  }

  return {
    gridProps,
  }
}

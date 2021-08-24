import { useCallback, useMemo, useState } from 'react'

import { getTime, startOfYear } from '../../libs/date'
import { useDateFormatter } from '../../libs/i18n'
import { EXTRA_STEP, MAX_DEFAULT_DATE, MIN_DEFAULT_DATE } from './constants'
import {
  DateLike,
  DateTimeEditableSegmentKind,
  DateTimeEditableSegmentTypes,
  DateTimeSegment,
} from './types'
import {
  getInitialValueForStep,
  getResolvedOptions,
  isPlaceholderSegmentType,
  resolveDateTimeSegments,
  resolveSegmentLimits,
  resolveValidSegmentsState,
  setDateSegmentValue,
  stepValue,
} from './utils'

export interface UseDateTimeFieldStateProps {
  value?: DateLike
  min?: DateLike
  max?: DateLike
  disabled?: boolean
  readOnly?: boolean
  placeholder?: DateLike
  formatOptions?: Intl.DateTimeFormatOptions
  onChange?: (value: Date) => void
}

export interface UseDateTimeFieldStateResult {
  resolvedOptions: Intl.ResolvedDateTimeFormatOptions
  segments: DateTimeSegment[]
  setSegmentValue: (type: DateTimeEditableSegmentTypes, value: number | null) => void
  increment: (type: DateTimeEditableSegmentTypes) => void
  decrement: (type: DateTimeEditableSegmentTypes) => void
  extraIncrement: (type: DateTimeEditableSegmentTypes) => void
  extraDecrement: (type: DateTimeEditableSegmentTypes) => void
  incrementToMax: (type: DateTimeEditableSegmentTypes) => void
  decrementToMin: (type: DateTimeEditableSegmentTypes) => void
}

export function useDateTimeFieldState(
  props: UseDateTimeFieldStateProps,
): UseDateTimeFieldStateResult {
  const {
    value: _value,
    min: minValue = MIN_DEFAULT_DATE,
    max: maxValue = MAX_DEFAULT_DATE,
    placeholder: _placeholder,
    formatOptions,
    disabled,
    readOnly,
    onChange,
  } = props
  const formatter = useDateFormatter(formatOptions)
  const resolvedOptions = useMemo(() => getResolvedOptions(formatter), [formatter])

  const placeholder = getTime(_placeholder ?? startOfYear(new Date()))
  const [placeholderDate, setPlaceholderDate] = useState(placeholder)

  const validState = useMemo(() => resolveValidSegmentsState(formatter), [formatter])
  const [_currentState, setCurrentState] = useState(_value ? validState : 0)
  // removing invalid bits from the current state,
  // because after changing the date format, the valid state may be change
  const currentState = _currentState & validState
  const value = currentState === validState ? getTime(_value ?? placeholderDate) : placeholderDate

  const segments = useMemo(() => {
    return resolveDateTimeSegments(formatter, value, minValue, maxValue, currentState)
  }, [formatter, value, minValue, maxValue, currentState])

  const changeState = useCallback(
    (type: DateTimeEditableSegmentTypes, v: number | null) => {
      let nextState = currentState

      if (v === null) {
        nextState &= ~DateTimeEditableSegmentKind[type]
      } else {
        nextState |= DateTimeEditableSegmentKind[type]
      }

      if (nextState !== currentState) {
        setCurrentState(nextState)
      }

      return nextState === validState
    },
    [currentState, validState],
  )

  const setSegmentValue = useCallback(
    (type: DateTimeEditableSegmentTypes, v: number | null) => {
      if (disabled || readOnly) {
        return
      }

      const { value: defaultValue } = resolveSegmentLimits(type, placeholder, minValue, maxValue)
      const segmentValue = v ?? defaultValue

      const isValid = changeState(type, v)
      const dateValue = setDateSegmentValue(value, type, segmentValue)

      setPlaceholderDate(dateValue.getTime())

      if (isValid) {
        onChange?.(dateValue)
      }
    },
    [disabled, readOnly, placeholder, minValue, maxValue, changeState, value, onChange],
  )

  const stepHandler = useCallback(
    (type: DateTimeEditableSegmentTypes, step: number) => {
      const isPlaceholder = isPlaceholderSegmentType(currentState, type)
      const limits = resolveSegmentLimits(type, value, minValue, maxValue)
      const round = type === 'hour' || type === 'minute' || type === 'second'
      const newValue = isPlaceholder
        ? getInitialValueForStep(type, step, limits, minValue, maxValue)
        : stepValue({ ...limits, step, round })

      setSegmentValue(type, newValue)
    },
    [currentState, value, maxValue, minValue, setSegmentValue],
  )

  const increment = useCallback(
    (type: DateTimeEditableSegmentTypes) => stepHandler(type, 1),
    [stepHandler],
  )

  const decrement = useCallback(
    (type: DateTimeEditableSegmentTypes) => stepHandler(type, -1),
    [stepHandler],
  )

  const extraIncrement = useCallback(
    (type: DateTimeEditableSegmentTypes) => stepHandler(type, EXTRA_STEP[type] || 1),
    [stepHandler],
  )

  const extraDecrement = useCallback(
    (type: DateTimeEditableSegmentTypes) => stepHandler(type, -(EXTRA_STEP[type] || 1)),
    [stepHandler],
  )

  const incrementToMax = useCallback(
    (type: DateTimeEditableSegmentTypes) => {
      const { max } = resolveSegmentLimits(type, value, minValue, maxValue)

      setSegmentValue(type, max)
    },
    [value, maxValue, minValue, setSegmentValue],
  )

  const decrementToMin = useCallback(
    (type: DateTimeEditableSegmentTypes) => {
      const { min } = resolveSegmentLimits(type, value, minValue, maxValue)

      setSegmentValue(type, min)
    },
    [value, maxValue, minValue, setSegmentValue],
  )

  return {
    resolvedOptions,
    segments,
    setSegmentValue,
    increment,
    decrement,
    extraIncrement,
    extraDecrement,
    incrementToMax,
    decrementToMin,
  }
}

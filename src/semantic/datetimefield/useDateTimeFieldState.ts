import { useCallback, useMemo, useRef, useState } from 'react'

import { useDateFormatter } from '../../libs/i18n'
import { EXTRA_STEP } from './constants'
import {
  DateLike,
  DateTimeChangeEvent,
  DateTimeEditableSegmentTypes,
  DateTimeSegment,
} from './types'
import { DateComponents } from './utils/DateComponents'
import { DateTimeFieldAdapter } from './utils/DateTimeFieldAdapter'

export interface UseDateTimeFieldStateProps {
  value?: DateLike | null
  min?: DateLike
  max?: DateLike
  disabled?: boolean
  readOnly?: boolean
  placeholder?: DateLike
  formatOptions?: Intl.DateTimeFormatOptions
  onChange?: (event: DateTimeChangeEvent) => void
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
    value: propValue = null,
    min: propMin,
    max: propMax,
    placeholder: propPlaceholder,
    formatOptions,
    disabled,
    readOnly,
    onChange,
  } = props
  const lastValueChange = useRef<DateLike | null>(null)
  const formatter = useDateFormatter(formatOptions)
  const adapter = useMemo(() => {
    return new DateTimeFieldAdapter({
      formatter,
      min: propMin,
      max: propMax,
      placeholder: propPlaceholder,
    })
  }, [formatter, propMax, propMin, propPlaceholder])

  const [localValue, setLocalValue] = useState(() => {
    return adapter.normalizeDateComponents(DateComponents.from(propValue))
  })

  const value = useMemo(() => {
    if (lastValueChange.current !== propValue) {
      return DateComponents.from(propValue)
    }

    return localValue
  }, [propValue, localValue])

  lastValueChange.current = propValue

  const segments = useMemo(() => adapter.getSegments(value), [adapter, value])

  const setSegmentValue = useCallback(
    (type: DateTimeEditableSegmentTypes, segmentValue: number | null) => {
      if (disabled || readOnly) {
        return
      }

      const newLocalValue = adapter.setSegmentValue(value, type, segmentValue)
      if (DateComponents.isEqual(value, newLocalValue)) {
        return
      }

      setLocalValue(newLocalValue)
      const date = adapter.toDate(newLocalValue)

      if (date !== lastValueChange.current) {
        onChange?.({ value: date })
      }

      lastValueChange.current = date
    },
    [disabled, readOnly, adapter, value, onChange],
  )

  const stepHandler = useCallback(
    (type: DateTimeEditableSegmentTypes, step: number) => {
      const segmentValue = adapter.moveByStep(value, type, step)

      setSegmentValue(type, segmentValue)
    },
    [adapter, value, setSegmentValue],
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
      const { max } = adapter.getLimits(value, type)

      setSegmentValue(type, max)
    },
    [adapter, setSegmentValue, value],
  )

  const decrementToMin = useCallback(
    (type: DateTimeEditableSegmentTypes) => {
      const { min } = adapter.getLimits(value, type)

      setSegmentValue(type, min)
    },
    [adapter, setSegmentValue, value],
  )

  return {
    resolvedOptions: adapter.resolvedOptions,
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

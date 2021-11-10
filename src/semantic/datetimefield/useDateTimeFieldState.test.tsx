import { useCallback, useState } from 'react'

import { renderHook, act } from '../../libs/testing'
import { DateInputChangeEvent, DateLike } from '../../shared/types'
import { DateTimeEditableSegment, DateTimeEditableSegmentTypes, DateTimeSegment } from './types'
import { useDateTimeFieldState } from './useDateTimeFieldState'

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
}
const DEFAULT_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
}
const DEFAULT_DATETIME_FORMAT = { ...DEFAULT_DATE_FORMAT, ...DEFAULT_TIME_FORMAT }

function findSegment(segments: DateTimeSegment[], type: DateTimeEditableSegmentTypes) {
  return segments.find((segment) => segment.type === type) as DateTimeEditableSegment | undefined
}

function useDateTimeValue(
  initialValue?: DateLike | null,
  onChange?: (event: DateInputChangeEvent<DateLike | null>) => void,
) {
  const [value, setValue] = useState<DateLike | null>(initialValue ?? null)

  const handleChange = useCallback(
    (event: DateInputChangeEvent<DateLike | null>) => {
      setValue(event.value)
      onChange?.(event)
    },
    [onChange],
  )

  return [value, handleChange] as const
}

describe('useDateTimeFieldState', () => {
  test.each`
    type           | segmentValue
    ${'day'}       | ${24}
    ${'month'}     | ${10}
    ${'year'}      | ${1998}
    ${'hour'}      | ${16}
    ${'minute'}    | ${46}
    ${'second'}    | ${31}
    ${'dayPeriod'} | ${1}
  `('should increment $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.increment(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | segmentValue
    ${'day'}       | ${22}
    ${'month'}     | ${8}
    ${'year'}      | ${1996}
    ${'hour'}      | ${14}
    ${'minute'}    | ${44}
    ${'second'}    | ${29}
    ${'dayPeriod'} | ${1}
  `('should decrement $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.decrement(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | segmentValue
    ${'day'}       | ${30}
    ${'month'}     | ${12}
    ${'year'}      | ${2007}
    ${'hour'}      | ${16}
    ${'minute'}    | ${50}
    ${'second'}    | ${35}
    ${'dayPeriod'} | ${1}
  `('should extraIncrement $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.extraIncrement(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | segmentValue
    ${'day'}       | ${16}
    ${'month'}     | ${6}
    ${'year'}      | ${1987}
    ${'hour'}      | ${14}
    ${'minute'}    | ${40}
    ${'second'}    | ${25}
    ${'dayPeriod'} | ${1}
  `('should extraDecrement $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.extraDecrement(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | segmentValue
    ${'day'}       | ${30}
    ${'month'}     | ${12}
    ${'year'}      | ${9999}
    ${'hour'}      | ${23}
    ${'minute'}    | ${59}
    ${'second'}    | ${59}
    ${'dayPeriod'} | ${2}
  `('should incrementToMax $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.incrementToMax(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | segmentValue
    ${'day'}       | ${1}
    ${'month'}     | ${1}
    ${'year'}      | ${1}
    ${'hour'}      | ${0}
    ${'minute'}    | ${0}
    ${'second'}    | ${0}
    ${'dayPeriod'} | ${1}
  `('should decrementToMin $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.decrementToMin(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | max                                  | segmentValue
    ${'day'}       | ${new Date(1997, 8, 25, 15, 45, 30)} | ${25}
    ${'month'}     | ${new Date(1997, 7, 23, 15, 45, 30)} | ${8}
    ${'year'}      | ${new Date(2000, 8, 23, 15, 45, 30)} | ${2000}
    ${'hour'}      | ${new Date(1997, 8, 23, 21, 45, 30)} | ${21}
    ${'minute'}    | ${new Date(1997, 8, 23, 15, 54, 30)} | ${54}
    ${'second'}    | ${new Date(1997, 8, 23, 15, 45, 58)} | ${58}
    ${'dayPeriod'} | ${new Date(1997, 8, 23, 11, 45, 30)} | ${1}
  `('should incrementToMax $type value to segment limit', ({ type, max, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT, max })
    })

    act(() => {
      result.current.incrementToMax(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | min                                  | segmentValue
    ${'day'}       | ${new Date(1997, 8, 3, 15, 45, 30)}  | ${3}
    ${'month'}     | ${new Date(1997, 4, 23, 15, 45, 30)} | ${5}
    ${'year'}      | ${new Date(1991, 8, 23, 15, 45, 30)} | ${1991}
    ${'hour'}      | ${new Date(1997, 8, 23, 6, 45, 30)}  | ${6}
    ${'minute'}    | ${new Date(1997, 8, 23, 15, 15, 30)} | ${15}
    ${'second'}    | ${new Date(1997, 8, 23, 15, 45, 11)} | ${11}
    ${'dayPeriod'} | ${new Date(1997, 8, 23, 15, 45, 30)} | ${2}
  `('should decrementToMin $type value to segment limit', ({ type, min, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT, min })
    })

    act(() => {
      result.current.decrementToMin(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    type           | segmentValue
    ${'day'}       | ${4}
    ${'month'}     | ${2}
    ${'year'}      | ${1993}
    ${'hour'}      | ${13}
    ${'minute'}    | ${9}
    ${'second'}    | ${33}
    ${'dayPeriod'} | ${2}
  `(
    'should set initial value on increment $type segment if min specified',
    ({ type, segmentValue }) => {
      const min = new Date(1993, 1, 4, 13, 9, 33)

      const { result } = renderHook(() => {
        return useDateTimeFieldState({ formatOptions: DEFAULT_DATETIME_FORMAT, min })
      })

      act(() => {
        result.current.increment(type)
      })

      expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
    },
  )

  test.each`
    type           | segmentValue
    ${'day'}       | ${14}
    ${'month'}     | ${10}
    ${'year'}      | ${2024}
    ${'hour'}      | ${11}
    ${'minute'}    | ${9}
    ${'second'}    | ${43}
    ${'dayPeriod'} | ${1}
  `(
    'should set initial value on decrement $type segment if max specified',
    ({ type, segmentValue }) => {
      const max = new Date(2024, 9, 14, 11, 9, 43)

      const { result } = renderHook(() => {
        return useDateTimeFieldState({ formatOptions: DEFAULT_DATETIME_FORMAT, max })
      })

      act(() => {
        result.current.decrement(type)
      })

      expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
    },
  )

  test.each`
    type           | segmentValue
    ${'day'}       | ${13}
    ${'month'}     | ${4}
    ${'year'}      | ${2020}
    ${'hour'}      | ${6}
    ${'minute'}    | ${37}
    ${'second'}    | ${16}
    ${'dayPeriod'} | ${1}
  `('should set $type value with setSegmentValue', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.setSegmentValue(type, segmentValue)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

  test.each`
    name               | dayPeriod | initialValue                 | hours
    ${'from pm to am'} | ${1}      | ${new Date(1997, 8, 23, 15)} | ${3}
    ${'from am to pm'} | ${2}      | ${new Date(1997, 8, 23, 5)}  | ${17}
    ${'from am to am'} | ${1}      | ${new Date(1997, 8, 23, 5)}  | ${5}
    ${'from pm to pm'} | ${2}      | ${new Date(1997, 8, 23, 15)} | ${15}
  `('should update hours after change dayPeriod $name', ({ dayPeriod, initialValue, hours }) => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.setSegmentValue('dayPeriod', dayPeriod)
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', hours)
  })

  test('should trigger onChange', () => {
    const onChange = jest.fn()
    const { result, rerender } = renderHook(
      ({ value }) => {
        return useDateTimeFieldState({
          value,
          onChange,
          formatOptions: DEFAULT_DATE_FORMAT,
        })
      },
      {
        initialProps: {
          value: null as DateLike | null,
        },
      },
    )

    act(() => {
      result.current.setSegmentValue('day', 23)
    })

    act(() => {
      result.current.setSegmentValue('month', 9)
    })

    act(() => {
      result.current.setSegmentValue('year', 1997)
    })

    expect(onChange).toBeCalledTimes(1)
    expect(onChange.mock.calls[0][0].value.getTime()).toBe(new Date(1997, 8, 23).getTime())

    rerender({ value: new Date(1997, 8, 23) })

    act(() => {
      result.current.setSegmentValue('year', null)
    })

    expect(onChange).toBeCalledTimes(2)
    expect(onChange.mock.calls[1][0].value).toBe(null)

    act(() => {
      result.current.setSegmentValue('year', 2020)
    })

    expect(onChange).toBeCalledTimes(3)
    expect(onChange.mock.calls[2][0].value.getTime()).toBe(new Date(2020, 8, 23).getTime())
  })

  test('should set min value on increment if it is out of range', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 0, 1, 23))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 0, 1, 2),
        max: new Date(2000, 0, 1, 22),
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    act(() => {
      result.current.increment('hour')
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 2)
  })

  test('should set max value on decrement if it is out of range', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 0, 1, 1))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 0, 1, 2),
        max: new Date(2000, 0, 1, 22),
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    act(() => {
      result.current.decrement('hour')
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 22)
  })

  test('should set clamped value passed to setSegmentValue', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 0, 1, 1))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 0, 1, 2),
        max: new Date(2000, 0, 1, 22),
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    act(() => {
      result.current.setSegmentValue('hour', 0)
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 2)

    act(() => {
      result.current.setSegmentValue('hour', 23)
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 22)
  })

  test('should disabled year segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 8))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 0),
        max: new Date(2000, 11),
        formatOptions: DEFAULT_DATE_FORMAT,
      })
    })

    expect(findSegment(result.current.segments, 'year')).toHaveProperty('isDisabled', true)
  })

  test('should disabled month segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 8, 1))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 8, 1),
        max: new Date(2000, 9, 0),
        formatOptions: DEFAULT_DATE_FORMAT,
      })
    })

    expect(findSegment(result.current.segments, 'month')).toHaveProperty('isDisabled', true)
  })

  test('should disabled day segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 8, 1, 0))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 8, 1, 0),
        max: new Date(2000, 8, 1, 23),
        formatOptions: DEFAULT_DATE_FORMAT,
      })
    })

    expect(findSegment(result.current.segments, 'day')).toHaveProperty('isDisabled', true)
  })

  test('should disabled hour segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 8, 1, 14, 0))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 8, 1, 14, 0),
        max: new Date(2000, 8, 1, 14, 59),
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('isDisabled', true)
  })

  test('should disabled minute segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 8, 1, 14, 0, 0))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 8, 1, 14, 0, 0),
        max: new Date(2000, 8, 1, 14, 0, 59),
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    expect(findSegment(result.current.segments, 'minute')).toHaveProperty('isDisabled', true)
  })

  test('should disabled seconds segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 8, 1, 14, 0, 0, 0))
      return useDateTimeFieldState({
        value,
        onChange,
        min: new Date(2000, 8, 1, 14, 0, 0, 0),
        max: new Date(2000, 8, 1, 14, 0, 0, 999),
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    expect(findSegment(result.current.segments, 'second')).toHaveProperty('isDisabled', true)
  })

  test.each`
    type        | minSegmentValue             | maxSegmentValue
    ${'year'}   | ${new Date().getFullYear()} | ${new Date().getFullYear()}
    ${'month'}  | ${1}                        | ${12}
    ${'day'}    | ${1}                        | ${31}
    ${'hour'}   | ${0}                        | ${23}
    ${'minute'} | ${0}                        | ${59}
    ${'second'} | ${0}                        | ${59}
  `('should set valid default value for $type on step handler', (data) => {
    const { type, minSegmentValue, maxSegmentValue } = data
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2000, 0))
      return useDateTimeFieldState({
        value,
        onChange,
        placeholder: new Date(1997, 8, 10, 11, 12, 13),
        formatOptions: DEFAULT_DATETIME_FORMAT,
      })
    })

    const getActual = () => findSegment(result.current.segments, type)

    const resetAndAction = (callback: () => void) => {
      act(() => {
        result.current.setSegmentValue(type, null)
      })

      act(() => {
        callback()
      })
    }

    resetAndAction(() => result.current.increment(type))
    expect(getActual()).toHaveProperty('value', minSegmentValue)

    resetAndAction(() => result.current.decrement(type))
    expect(getActual()).toHaveProperty('value', maxSegmentValue)

    resetAndAction(() => result.current.extraIncrement(type))
    expect(getActual()).toHaveProperty('value', minSegmentValue)

    resetAndAction(() => result.current.extraDecrement(type))
    expect(getActual()).toHaveProperty('value', maxSegmentValue)
  })

  test('should change dayPeriod segment when hour changes', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(null)

      return useDateTimeFieldState({
        value,
        onChange,
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    const a = findSegment(result.current.segments, 'dayPeriod')
    expect(a).toHaveProperty('value', null)
    expect(a).toHaveProperty('isPlaceholder', true)

    act(() => {
      result.current.setSegmentValue('hour', 5)
    })

    const b = findSegment(result.current.segments, 'dayPeriod')
    expect(b).toHaveProperty('value', 1)
    expect(b).toHaveProperty('isPlaceholder', false)

    act(() => {
      result.current.setSegmentValue('hour', 14)
    })

    const c = findSegment(result.current.segments, 'dayPeriod')
    expect(c).toHaveProperty('value', 2)
    expect(c).toHaveProperty('isPlaceholder', false)

    act(() => {
      result.current.setSegmentValue('hour', null)
    })

    const d = findSegment(result.current.segments, 'dayPeriod')
    expect(d).toHaveProperty('value', null)
    expect(d).toHaveProperty('isPlaceholder', true)
  })

  test('should change hour segment when dayPeriod changes', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(null)

      return useDateTimeFieldState({
        value,
        onChange,
        formatOptions: DEFAULT_TIME_FORMAT,
      })
    })

    const a = findSegment(result.current.segments, 'hour')
    expect(a).toHaveProperty('value', null)
    expect(a).toHaveProperty('isPlaceholder', true)

    act(() => {
      result.current.setSegmentValue('dayPeriod', 1)
    })

    const b = findSegment(result.current.segments, 'hour')
    expect(b).toHaveProperty('value', 0)
    expect(b).toHaveProperty('isPlaceholder', false)

    act(() => {
      result.current.setSegmentValue('hour', null)
    })

    act(() => {
      result.current.setSegmentValue('dayPeriod', 2)
    })

    const c = findSegment(result.current.segments, 'hour')
    expect(c).toHaveProperty('value', 12)
    expect(c).toHaveProperty('isPlaceholder', false)

    act(() => {
      result.current.setSegmentValue('hour', 14)
    })
    act(() => {
      result.current.setSegmentValue('dayPeriod', 1)
    })

    const d = findSegment(result.current.segments, 'hour')
    expect(d).toHaveProperty('value', 2)
    expect(d).toHaveProperty('isPlaceholder', false)

    act(() => {
      result.current.setSegmentValue('dayPeriod', 2)
    })

    const e = findSegment(result.current.segments, 'hour')
    expect(e).toHaveProperty('value', 14)
    expect(e).toHaveProperty('isPlaceholder', false)
  })

  test('should allow set an invalid date', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => {
      const [value, setValue] = useDateTimeValue(null, onChange)

      return useDateTimeFieldState({
        value,
        onChange: setValue,
        formatOptions: DEFAULT_DATE_FORMAT,
      })
    })

    act(() => {
      result.current.setSegmentValue('day', 31)
    })

    act(() => {
      result.current.setSegmentValue('month', 2)
    })

    act(() => {
      result.current.setSegmentValue('year', 2021)
    })

    expect(findSegment(result.current.segments, 'day')).toHaveProperty('value', 31)
    expect(findSegment(result.current.segments, 'month')).toHaveProperty('value', 2)
    expect(findSegment(result.current.segments, 'year')).toHaveProperty('value', 2021)

    expect(onChange).toHaveBeenCalledTimes(0)

    act(() => {
      result.current.setSegmentValue('day', 28)
    })

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test('should numeric format day value', () => {
    const { result } = renderHook(() => {
      return useDateTimeFieldState({
        formatOptions: {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        },
      })
    })

    act(() => {
      result.current.setSegmentValue('month', 2)
    })

    act(() => {
      result.current.setSegmentValue('day', 31)
    })

    expect(findSegment(result.current.segments, 'day')).toHaveProperty('text', '31')
    expect(findSegment(result.current.segments, 'month')).toHaveProperty('text', '2')

    act(() => {
      result.current.setSegmentValue('day', 4)
    })

    expect(findSegment(result.current.segments, 'day')).toHaveProperty('text', '4')
    expect(findSegment(result.current.segments, 'month')).toHaveProperty('text', '2')
  })

  test.each([true, false])('should trigger onChange for "hour12=%s" time format', (hour12) => {
    const onChange = jest.fn()
    const { result } = renderHook(() => {
      return useDateTimeFieldState({
        onChange,
        formatOptions: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12 },
      })
    })

    act(() => result.current.setSegmentValue('hour', 23))
    act(() => result.current.setSegmentValue('minute', 34))
    act(() => result.current.setSegmentValue('second', 45))

    expect(onChange).toBeCalledTimes(1)
    const { value } = onChange.mock.calls[0][0]
    expect(value.getHours()).toBe(23)
    expect(value.getMinutes()).toBe(34)
    expect(value.getSeconds()).toBe(45)
  })

  test('should set value after update prop', () => {
    const { result, rerender } = renderHook(
      ({ value }) => {
        return useDateTimeFieldState({ value })
      },
      {
        initialProps: {
          value: null as DateLike | null,
        },
      },
    )

    rerender({ value: new Date(1990, 0) })

    expect(findSegment(result.current.segments, 'year')).toHaveProperty('value', 1990)
  })

  test('should unset value after update prop', () => {
    const { result, rerender } = renderHook(
      ({ value }) => {
        return useDateTimeFieldState({ value })
      },
      {
        initialProps: {
          value: new Date(1990, 0) as DateLike | null,
        },
      },
    )

    rerender({ value: null })

    expect(findSegment(result.current.segments, 'year')).toHaveProperty('value', null)
  })

  test('should not reset hours if segment value is set to 12', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useDateTimeValue(new Date(2021, 10, 10, 12, 45))
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 12)
  })
})

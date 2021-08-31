import { useState } from 'react'

import { renderHook, act } from '../../libs/testing'
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
      const [value, onChange] = useState(initialValue)
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
      const [value, onChange] = useState(initialValue)
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
      const [value, onChange] = useState(initialValue)
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
      const [value, onChange] = useState(initialValue)
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
      const [value, onChange] = useState(initialValue)
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
    ${'year'}      | ${1900}
    ${'hour'}      | ${0}
    ${'minute'}    | ${0}
    ${'second'}    | ${0}
    ${'dayPeriod'} | ${1}
  `('should decrementToMin $type value', ({ type, segmentValue }) => {
    const initialValue = new Date(1997, 8, 23, 15, 45, 30)
    const { result } = renderHook(() => {
      const [value, onChange] = useState(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.decrementToMin(type)
    })

    expect(findSegment(result.current.segments, type)).toHaveProperty('value', segmentValue)
  })

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
      const [value, onChange] = useState(initialValue)
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
      const [value, onChange] = useState(initialValue)
      return useDateTimeFieldState({ value, onChange, formatOptions: DEFAULT_DATETIME_FORMAT })
    })

    act(() => {
      result.current.setSegmentValue('dayPeriod', dayPeriod)
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', hours)
  })

  test('should trigger onChange if only are all segments filled', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => {
      return useDateTimeFieldState({ onChange, formatOptions: DEFAULT_DATE_FORMAT })
    })

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
    expect(onChange.mock.calls[0][0].getTime()).toBe(new Date(1997, 8, 23).getTime())

    act(() => {
      result.current.setSegmentValue('year', null)
    })

    expect(onChange).toBeCalledTimes(1)

    act(() => {
      result.current.setSegmentValue('year', 2020)
    })

    expect(onChange).toBeCalledTimes(2)
    expect(onChange.mock.calls[1][0].getTime()).toBe(new Date(2020, 8, 23).getTime())
  })

  test('should set min value on increment if it is out of range', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useState(new Date(2000, 0, 1, 23))
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
      const [value, onChange] = useState(new Date(2000, 0, 1, 1))
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

  test('should set value on setSegmentValue as is', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useState(new Date(2000, 0, 1, 1))
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

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 0)

    act(() => {
      result.current.setSegmentValue('hour', 23)
    })

    expect(findSegment(result.current.segments, 'hour')).toHaveProperty('value', 23)
  })

  test('should disabled year segment', () => {
    const { result } = renderHook(() => {
      const [value, onChange] = useState(new Date(2000, 8))
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
      const [value, onChange] = useState(new Date(2000, 8, 1))
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
      const [value, onChange] = useState(new Date(2000, 8, 1, 0))
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
      const [value, onChange] = useState(new Date(2000, 8, 1, 14, 0))
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
      const [value, onChange] = useState(new Date(2000, 8, 1, 14, 0, 0))
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
      const [value, onChange] = useState(new Date(2000, 8, 1, 14, 0, 0, 0))
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
    type        | minSegmentValue | maxSegmentValue
    ${'year'}   | ${1997}         | ${1997}
    ${'month'}  | ${1}            | ${12}
    ${'day'}    | ${1}            | ${31}
    ${'hour'}   | ${0}            | ${23}
    ${'minute'} | ${0}            | ${59}
    ${'second'} | ${0}            | ${59}
  `('should set valid default value for $type on step handler', (data) => {
    const { type, minSegmentValue, maxSegmentValue } = data
    const { result } = renderHook(() => {
      const [value, onChange] = useState(new Date(2000, 0))
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
})

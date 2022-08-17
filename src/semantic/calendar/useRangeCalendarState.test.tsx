import { act, renderHook } from '../../internal/testing'
import { DateInputChangeEvent, DateRangeValue } from '../../shared/types'
import { useRangeCalendarState } from './useRangeCalendarState'

describe('useRangeCalendarState', () => {
  test('should return range mode', () => {
    const { result } = renderHook(() => useRangeCalendarState({}))

    expect(result.current.mode).toBe('range')
  })

  test('should trigger onChange when select date', () => {
    const start = new Date(2021, 11, 10)
    const end = new Date(2021, 11, 29)
    const onChange = jest.fn<any, [DateInputChangeEvent<DateRangeValue>]>()
    const { result } = renderHook(() => useRangeCalendarState({ onChange }))

    act(() => {
      result.current.selectDate(start)
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].value.start?.getTime()).toBe(start.getTime())
    expect(onChange.mock.calls[0][0].value.end).toBeNull()

    act(() => {
      result.current.selectDate(end)
    })

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange.mock.calls[1][0].value.start?.getTime()).toBe(start.getTime())
    expect(onChange.mock.calls[1][0].value.end?.getTime()).toBe(end.getTime())
  })

  test('should return correct date range', () => {
    const start = new Date(2021, 11, 10)
    const end = new Date(2021, 10, 29)
    const onChange = jest.fn<any, [DateInputChangeEvent<DateRangeValue>]>()
    const { result } = renderHook(() => useRangeCalendarState({ onChange }))

    act(() => {
      result.current.selectDate(start)
    })

    act(() => {
      result.current.selectDate(end)
    })

    expect(onChange.mock.calls[1][0].value.start?.getTime()).toBe(end.getTime())
    expect(onChange.mock.calls[1][0].value.end?.getTime()).toBe(start.getTime())
  })
})

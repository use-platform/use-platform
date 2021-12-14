import { act, renderHook } from '../../libs/testing'
import { useDateRangePickerState } from './useDateRangePickerState'

describe('useDateRangePickerState', () => {
  test('should update isOpen after setOpen', () => {
    const { result } = renderHook(() => useDateRangePickerState({}))

    expect(result.current.isOpen).toBeFalsy()
    act(() => result.current.setOpen(true))
    expect(result.current.isOpen).toBeTruthy()
  })

  test('should call onChange with value after setValue', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => useDateRangePickerState({ onChange }))

    act(() =>
      result.current.setValue({
        value: { start: new Date(2020, 10, 10), end: new Date(2020, 10, 11) },
      }),
    )
    const expectedStartDate = new Date(2020, 10, 10)
    const expectedEndDate = new Date(2020, 10, 11)
    const { start, end } = onChange.mock.calls[0][0].value

    expect(start.getTime()).toEqual(expectedStartDate.getTime())
    expect(end.getTime()).toEqual(expectedEndDate.getTime())
  })

  test('should save time from value after change', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useDateRangePickerState({
        onChange,
        value: {
          start: new Date(2020, 10, 10, 10, 45),
          end: new Date(2020, 10, 11, 10, 50),
        },
      }),
    )

    act(() =>
      result.current.setValue({
        value: { start: new Date(2020, 10, 20), end: new Date(2020, 10, 21) },
      }),
    )
    const expectedStartDate = new Date(2020, 10, 20, 10, 45)
    const expectedEndDate = new Date(2020, 10, 21, 10, 50)
    const { start, end } = onChange.mock.calls[0][0].value

    expect(start.getTime()).toEqual(expectedStartDate.getTime())
    expect(end.getTime()).toEqual(expectedEndDate.getTime())
  })

  test('should use time from next value after change', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useDateRangePickerState({
        onChange,
        value: {
          start: new Date(2020, 10, 10, 10, 45),
          end: new Date(2020, 10, 11, 10, 50),
        },
      }),
    )

    act(() =>
      result.current.setValue({
        value: { start: new Date(2020, 10, 20, 10, 20), end: new Date(2020, 10, 21, 10, 30) },
      }),
    )
    const expectedStartDate = new Date(2020, 10, 20, 10, 20)
    const expectedEndDate = new Date(2020, 10, 21, 10, 30)
    const { start, end } = onChange.mock.calls[0][0].value

    expect(start.getTime()).toEqual(expectedStartDate.getTime())
    expect(end.getTime()).toEqual(expectedEndDate.getTime())
  })

  test('should update isOpen to false if set start and end', () => {
    const { result } = renderHook(() => useDateRangePickerState({}))

    act(() => result.current.setOpen(true))
    act(() =>
      result.current.setValue({
        value: { start: new Date(2020, 10, 20, 10, 20), end: null },
      }),
    )

    expect(result.current.isOpen).toBeTruthy()

    act(() =>
      result.current.setValue({
        value: { start: new Date(2020, 10, 20, 10, 20), end: new Date(2020, 10, 21, 10, 30) },
      }),
    )

    expect(result.current.isOpen).toBeFalsy()
  })
})

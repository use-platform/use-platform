import { act, renderHook } from '../../libs/testing'
import { useDatePickerState } from './useDatePickerState'

describe('useDatePickerState', () => {
  test('should update isOpen after setOpen', () => {
    const { result } = renderHook(() => useDatePickerState({}))

    expect(result.current.isOpen).toBeFalsy()
    act(() => result.current.setOpen(true))
    expect(result.current.isOpen).toBeTruthy()
  })

  test('should call onChange with value after setValue', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => useDatePickerState({ onChange }))

    act(() => result.current.setValue({ value: new Date(2020, 10, 10) }))
    const expectedDate = new Date(2020, 10, 10)
    const nextDate = onChange.mock.calls[0][0].value

    expect(nextDate.getTime()).toEqual(expectedDate.getTime())
  })

  test('should save time from value after change', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useDatePickerState({ onChange, value: new Date(2020, 10, 10, 10, 45) }),
    )

    act(() => result.current.setValue({ value: new Date(2020, 10, 20) }))
    const expectedDate = new Date(2020, 10, 20, 10, 45)
    const nextDate = onChange.mock.calls[0][0].value

    expect(nextDate.getTime()).toEqual(expectedDate.getTime())
  })

  test('should use time from next value after change', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useDatePickerState({ onChange, value: new Date(2020, 10, 10, 10, 45) }),
    )

    act(() => result.current.setValue({ value: new Date(2020, 10, 20, 10, 20) }))
    const expectedDate = new Date(2020, 10, 20, 10, 20)
    const nextDate = onChange.mock.calls[0][0].value

    expect(nextDate.getTime()).toEqual(expectedDate.getTime())
  })
})

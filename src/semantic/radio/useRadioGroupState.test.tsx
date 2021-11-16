import { renderHook, act } from '../../libs/testing'
import { useRadioGroupState } from './useRadioGroupState'
import { useUniqId } from '../../libs/uniq-id'

jest.mock('../../libs/uniq-id')
;(useUniqId as jest.MockedFunction<typeof useUniqId>).mockImplementation(
  (customId?: string) => customId || 'fakeRandomId',
)

describe('useRadioGroupState', () => {
  test('selected value should be set from props', () => {
    const { result } = renderHook(() => useRadioGroupState({ value: 'foo' }))
    expect(result.current.selectedValue).toBe('foo')
  })

  test('setValue function should set value', () => {
    const { result } = renderHook(() => useRadioGroupState({}))
    act(() => {
      result.current.setValue('foo')
    })
    expect(result.current.selectedValue).toBe('foo')
  })

  test('name should be returned from props', () => {
    const { result } = renderHook(({ name }) => useRadioGroupState({ name }), {
      initialProps: { name: 'foo' },
    })
    expect(result.current.name).toEqual('foo')
  })

  test('name should be randomly generated', () => {
    const { result } = renderHook(() => useRadioGroupState({}))
    expect(result.current.name).toBe('fakeRandomId')
  })

  test('disabled state should be set from props', () => {
    const { result } = renderHook(({ disabled }) => useRadioGroupState({ disabled }), {
      initialProps: { disabled: true },
    })
    expect(result.current.disabled).toBe(true)
  })

  test('readonly state should be set from props', () => {
    const { result } = renderHook(({ readOnly }) => useRadioGroupState({ readOnly }), {
      initialProps: { readOnly: true },
    })
    expect(result.current.readOnly).toBe(true)
  })
})

import { ChangeEvent } from 'react'

import { act, renderHook } from '../../libs/testing'
import { useUniqId } from '../../libs/uniq-id'
import { useRadioGroupState } from './useRadioGroupState'

jest.mock('../../libs/uniq-id')
;(useUniqId as jest.MockedFunction<typeof useUniqId>).mockImplementation(
  (customId?: string) => customId || 'fakeRandomId',
)

const dummyHTMLInputElement = document.createElement('input')
dummyHTMLInputElement.value = 'foo'
const dummyChangeEvent: ChangeEvent<HTMLInputElement> = {
  target: dummyHTMLInputElement,
  nativeEvent: new Event('change'),
  currentTarget: dummyHTMLInputElement,
  bubbles: false,
  cancelable: false,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: false,
  preventDefault: () => {},
  isDefaultPrevented: () => false,
  stopPropagation: () => {},
  isPropagationStopped: () => false,
  persist: () => {},
  timeStamp: 0,
  type: '',
}

describe('useRadioGroupState', () => {
  test('selected value should be set from props', () => {
    const { result } = renderHook(() => useRadioGroupState({ value: 'foo' }))
    expect(result.current.selectedValue).toBe('foo')
  })

  test('should use onChange handler in setSelectedValue callback', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() => useRadioGroupState({ onChange }))
    act(() => {
      result.current.setSelectedValue?.(dummyChangeEvent)
    })
    expect(onChange).toHaveBeenCalledWith(dummyChangeEvent)
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
    expect(result.current.isDisabled).toBe(true)
  })

  test('readonly state should be set from props', () => {
    const { result } = renderHook(({ readOnly }) => useRadioGroupState({ readOnly }), {
      initialProps: { readOnly: true },
    })
    expect(result.current.isReadOnly).toBe(true)
  })
})

import { act, renderHook } from '../testing'
import { useSelectionState } from './useSelectionState'

describe('useSelectionState', () => {
  test('should not select a key in none mode', () => {
    const onSelectionChange = jest.fn()
    const { result } = renderHook(() => {
      return useSelectionState({ selectionMode: 'none', onSelectionChange })
    })

    result.current.select('a')

    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  test('should toggle a key in single mode', () => {
    const { result } = renderHook(() => useSelectionState({ selectionMode: 'single' }))

    act(() => result.current.select('a'))

    expect(result.current.isSelected('a')).toBe(true)

    act(() => result.current.select('b'))

    expect(result.current.isSelected('a')).toBe(false)
    expect(result.current.isSelected('b')).toBe(true)
  })

  test('should deselect key in multiple mode', () => {
    const { result } = renderHook(() => useSelectionState({ selectionMode: 'multiple' }))

    act(() => result.current.select('a'))
    act(() => result.current.select('b'))
    act(() => result.current.select('c'))

    expect(result.current.isSelected('a')).toBe(true)
    expect(result.current.isSelected('b')).toBe(true)
    expect(result.current.isSelected('c')).toBe(true)

    act(() => result.current.select('b'))

    expect(result.current.isSelected('a')).toBe(true)
    expect(result.current.isSelected('b')).toBe(false)
    expect(result.current.isSelected('c')).toBe(true)
  })

  test.each`
    selectionMode
    ${'single'}
    ${'multiple'}
  `('should disallow empty selection in $selectionMode mode', ({ selectionMode }) => {
    const { result } = renderHook(() => {
      return useSelectionState({ selectionMode, disallowEmptySelection: true })
    })

    act(() => result.current.select('a'))

    expect(result.current.isSelected('a')).toBe(true)

    act(() => result.current.select('a'))

    expect(result.current.isSelected('a')).toBe(true)
  })

  test.each`
    selectionMode
    ${'single'}
    ${'multiple'}
  `(
    'should not called onSelectionChange for single key with disallow empty selection in $selectionMode mode',
    ({ selectionMode }) => {
      const onSelectionChange = jest.fn()
      const { result } = renderHook(() => {
        return useSelectionState({
          selectionMode,
          defaultSelectedKeys: ['foo'],
          disallowEmptySelection: true,
          onSelectionChange,
        })
      })

      act(() => result.current.select('foo'))

      expect(onSelectionChange).not.toHaveBeenCalled()
    },
  )
})

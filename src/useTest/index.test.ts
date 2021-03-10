import { renderHook } from '@testing-library/react-hooks'

import { useTest } from './index'

describe('useTest', () => {
  test('should call hook and return correct value', () => {
    const { result } = renderHook(() => useTest())
    expect(result.current).toBe(0)
  })
})

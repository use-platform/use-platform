import { CacheableList } from './CacheableList'

describe('CacheableList', () => {
  test('should call factory after accessing iterator', () => {
    const mockFactory = jest.fn(() => ['a', 'b', 'c'])
    const list = new CacheableList(mockFactory)

    expect(mockFactory).toHaveBeenCalledTimes(0)

    Array.from(list)

    expect(mockFactory).toHaveBeenCalledTimes(1)
  })

  test('should cache value', () => {
    const calcFn = jest.fn(() => {
      return { foo: 'bar' }
    })
    const list = new CacheableList(function* () {
      yield calcFn()
    })

    const a = Array.from(list)

    expect(calcFn).toHaveBeenCalledTimes(1)

    const b = Array.from(list)

    expect(calcFn).toHaveBeenCalledTimes(1)
    expect(a[0]).toBe(b[0])
  })
})

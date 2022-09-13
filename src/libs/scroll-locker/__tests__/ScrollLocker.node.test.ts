/**
 * @jest-environment node
 */
import * as ScrollLocker from '../ScrollLocker'

describe('ScrollLocker (ssr)', () => {
  test('Should work without errors in a server environment', () => {
    expect(() => {
      ScrollLocker.lock()
    }).not.toThrowError()

    expect(() => {
      ScrollLocker.unlock()
    }).not.toThrowError()
  })
})

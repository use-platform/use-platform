import { mergeProps } from './merge-props'

describe('mergeProps', () => {
  test('should merge aria-labelledby prop', () => {
    const a = { 'aria-labelledby': 'foo' }
    const b = { 'aria-labelledby': 'bar' }

    const result = mergeProps(a, b)
    expect(result['aria-labelledby']).toBe('foo bar')
  })

  test('should not repeat prop value', () => {
    const a = { 'aria-labelledby': 'foo' }
    const b = { 'aria-labelledby': 'foo' }

    const result = mergeProps(a, b)
    expect(result['aria-labelledby']).toBe('foo')
  })
})

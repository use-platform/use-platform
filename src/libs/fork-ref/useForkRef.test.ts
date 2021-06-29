import { Ref, createRef } from 'react'

import { renderHook } from '../testing'
import { useForkRef } from './useForkRef'

function renderForkRefHook(refA: Ref<any>, refB: Ref<any>) {
  const { result } = renderHook(() => useForkRef(refA, refB))

  return result.current
}

describe('useForkRef', () => {
  test('should copy value for each ref objects', () => {
    const refA = createRef()
    const refB = createRef()

    const setter = renderForkRefHook(refA, refB)
    setter?.('value' as any)

    expect(refA.current).toBe('value')
    expect(refB.current).toBe('value')
  })

  test('should copy value for each ref callbacks', () => {
    const refs = { a: null, b: null }
    const refA = (value: any) => {
      refs.a = value
    }
    const refB = (value: any) => {
      refs.b = value
    }

    const setter = renderForkRefHook(refA, refB)
    setter?.('value' as any)

    expect(refs.a).toBe('value')
    expect(refs.b).toBe('value')
  })
})

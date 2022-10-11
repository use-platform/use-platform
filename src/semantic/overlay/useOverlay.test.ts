import { RefObject } from 'react'

import { renderHook } from '../../internal/testing'
import { OverlayManager } from './OverlayManager'
import { UseOverlayOptions } from './types'
import { useOverlay } from './useOverlay'

describe('useOverlay', () => {
  test('should add layer if `visible` flag is set', () => {
    const essentialRefs: RefObject<HTMLElement>[] = []
    const { rerender } = renderHook<UseOverlayOptions, void>((options) => useOverlay(options), {
      initialProps: {
        visible: false,
        essentialRefs,
      },
    })

    expect(OverlayManager.count()).toBe(0)

    rerender({ visible: true, essentialRefs })

    expect(OverlayManager.count()).toBe(1)

    rerender({ visible: false, essentialRefs })

    expect(OverlayManager.count()).toBe(0)
  })

  test('should update `onClose` handler', () => {
    const onClose1 = jest.fn()
    const onClose2 = jest.fn()
    const essentialRefs: RefObject<HTMLElement>[] = []
    const { rerender } = renderHook<UseOverlayOptions, void>((options) => useOverlay(options), {
      initialProps: {
        visible: true,
        essentialRefs,
        onClose: onClose1,
      },
    })

    expect(OverlayManager.getTopOverlayOptions()!.onClose).toBe(onClose1)

    rerender({ visible: true, essentialRefs, onClose: onClose2 })

    expect(OverlayManager.getTopOverlayOptions()!.onClose).toBe(onClose2)
  })

  test('should update `essentialRefs`', () => {
    const essentialRefs1: RefObject<HTMLElement>[] = []
    const essentialRefs2: RefObject<HTMLElement>[] = []

    const { rerender } = renderHook<UseOverlayOptions, void>((options) => useOverlay(options), {
      initialProps: {
        visible: true,
        essentialRefs: essentialRefs1,
      },
    })

    expect(OverlayManager.getTopOverlayOptions()!.refs).toBe(essentialRefs1)

    rerender({ visible: true, essentialRefs: essentialRefs2 })

    expect(OverlayManager.getTopOverlayOptions()!.refs).toBe(essentialRefs2)
  })
})

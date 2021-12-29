import { useEffect, useRef } from 'react'

import { OverlayManager } from './OverlayManager'
import { OverlayOptions, UseOverlayOptions } from './types'

export function useOverlay(options: UseOverlayOptions) {
  const { visible, onClose, essentialRefs, unsafe_strategy: closeStrategy = 'pressdown' } = options
  const optionsRef = useRef<OverlayOptions>({ onClose, refs: essentialRefs, closeStrategy })

  optionsRef.current.onClose = onClose
  optionsRef.current.refs = essentialRefs

  useEffect(() => {
    if (visible) {
      const options = optionsRef.current

      OverlayManager.addOverlay(options)

      return () => {
        OverlayManager.removeOverlay(options)
      }
    }

    return
  }, [visible])
}

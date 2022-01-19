import { useEffect, useRef } from 'react'

import { UseOutsideClickProps, UseOutsideClickRefHTMLElement } from './types'

function isEssentionalClick(refs: UseOutsideClickRefHTMLElement[], target: HTMLElement | null) {
  return refs.some((ref) => {
    return ref.current instanceof HTMLElement && ref.current.contains(target)
  })
}

export function useOutsideClick(props: UseOutsideClickProps): void {
  const { onAction, refs, triggerStrategy, disabled } = props
  const partialPropsRef = useRef<Pick<UseOutsideClickProps, 'onAction' | 'refs'>>({
    onAction,
    refs,
  })
  partialPropsRef.current = { onAction, refs }

  useEffect(() => {
    let currentTarget: EventTarget | null = null
    const targetCapturer = (event: PointerEvent) => {
      currentTarget = event.target
    }
    const eventType = triggerStrategy === 'pressup' ? 'click' : 'pointerdown'
    const listener = (event: MouseEvent) => {
      if (event.button > 0 || disabled) {
        return
      }

      if (triggerStrategy === 'pressup') {
        const isSameTarget = currentTarget === event.target
        currentTarget = null

        if (!isSameTarget) {
          return
        }
      }
      if (!isEssentionalClick(partialPropsRef.current.refs, event.target as HTMLElement)) {
        partialPropsRef.current.onAction(event)
      }
    }
    document.addEventListener(eventType, listener)
    document.addEventListener('pointerdown', targetCapturer)

    return () => {
      document.removeEventListener(eventType, listener)
      document.removeEventListener('pointerdown', targetCapturer)
    }
  }, [triggerStrategy, disabled])
}

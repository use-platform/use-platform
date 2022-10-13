import { RefObject, useRef } from 'react'

import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../libs/isomorphic-layout-effect'
import * as ScrollLocker from '../../libs/scroll-locker'

export interface UsePreventScrollOptions {
  /**
   * Enables/disables scrolling for an element.
   */
  enabled: boolean | undefined

  /**
   * Reference to the DOM element whose scrolling should be disabled.
   *
   * @default document.body
   */
  containerRef?: RefObject<HTMLElement>
}

/**
 * Raact hook that prevents content from scrolling on an element.
 *
 * @example
 * const Modal: FC<ModalProps> = (props) => {
 *   const { visible } = props;
 *   const containerRef = useRef(document.documentElement);
 *
 *   usePreventScroll({ enabled: visible, containerRef });
 *
 *   ...
 * }
 */
export function usePreventScroll(options: UsePreventScrollOptions) {
  const { enabled, containerRef } = options
  const elementRef = useRef<HTMLElement | null>(null)
  const lockedRef = useRef(false)

  useLayoutEffect(() => {
    const container = containerRef ? containerRef.current : null

    if (elementRef.current === container) {
      return
    }

    // We handle the case when the reference to the element has changed,
    // and the current one has a lock enabled
    if (enabled && lockedRef.current) {
      ScrollLocker.unlock(elementRef.current)
      ScrollLocker.lock(container)
    }

    elementRef.current = container
  })

  useLayoutEffect(() => {
    if (!enabled) {
      return
    }

    lockedRef.current = true
    ScrollLocker.lock(elementRef.current)

    return () => {
      lockedRef.current = false
      ScrollLocker.unlock(elementRef.current)
    }
  }, [enabled])
}

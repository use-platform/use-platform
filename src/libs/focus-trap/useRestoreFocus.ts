import { RefObject, useEffect, useRef } from 'react'

import { canUseDom } from '../dom-utils'

export interface UseRestoreFocusProps {
  /**
   * Enables focus restore (saves last focused element).
   */
  enabled: boolean | undefined
  /**
   * Ref-container with dom-node uses for restore focus after disabling.
   *
   * @default {document.activeElement}
   */
  restoreFocusRef?: RefObject<HTMLElement>
}

/**
 * Restores focus in last focused element.
 *
 * @example
 * const Modal = (props) => {
 *   const { isVisible } = props
 *
 *   useRestoreFocus({ enabled: isVisible })
 *   ...
 * }
 */
export function useRestoreFocus(props: UseRestoreFocusProps) {
  const { enabled, restoreFocusRef } = props
  const initialActiveElement = useRef<HTMLElement | null>(null)
  const ref = useRef<HTMLElement | null>(null)

  if (enabled && !initialActiveElement.current) {
    // For elements with autoFocus React sets focus programmatically,
    // because important catch active element at render phase.
    initialActiveElement.current = canUseDom ? (document.activeElement as HTMLElement | null) : null
  }

  useEffect(() => {
    ref.current = restoreFocusRef ? restoreFocusRef.current : null
  })

  useEffect(() => {
    if (!enabled) {
      return
    }

    return () => {
      const element = ref.current || initialActiveElement.current
      initialActiveElement.current = null
      ref.current = null

      if (
        element &&
        element.focus &&
        document.body.contains(element) &&
        element !== document.activeElement
      ) {
        element.focus()
      }
    }
  }, [enabled])
}

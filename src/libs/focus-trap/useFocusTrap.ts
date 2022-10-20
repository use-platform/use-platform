import { ReactNode, RefObject, useEffect, useMemo, useRef } from 'react'

import { useIsomorphicLayoutEffect as useLayoutEffect } from '../isomorphic-layout-effect'
import { createFocusTrap } from './FocusTrap'
import { FocusTrapInstance, FocusTrapOptions } from './types'
import { useRestoreFocus } from './useRestoreFocus'

export interface UseFocusTrapProps {
  /**
   * Ref-container with dom-node for focus trap.
   */
  scopeRef: RefObject<HTMLElement>
  /**
   * Enables focus trap.
   */
  enabled: boolean | undefined
  /**
   * Returns focus in trigger after disabling trap.
   *
   * @default true
   */
  restoreFocus?: boolean
  /**
   * Ref-container with dom-node uses for restore focus after disabling trap.
   */
  restoreFocusRef?: RefObject<HTMLElement>
  /**
   * Sets focus in first focusable element inside trap.
   *
   * @default true
   */
  autoFocus?: boolean
  /**
   * Children content
   *
   * @default undefined
   */
  children?: ReactNode
}

/**
 * Creates focus trap for selected dom-node.
 *
 * @example
 * const Modal = (props) => {
 *   const { isVisible, children } = props
 *   const scopeRef = useRef(null)
 *
 *   useFocusTrap({ enabled: isVisible, scopeRef })
 *
 *   return (
 *     <div ref={scopeRef}>{children}</div>
 *   )
 * }
 */
export function useFocusTrap(props: UseFocusTrapProps) {
  const { scopeRef, enabled, restoreFocusRef, restoreFocus = true, autoFocus = true } = props
  const instance = useRef<FocusTrapInstance | null>(null)
  const ref = useRef<HTMLElement | null>(null)

  const trapOptions = useMemo<FocusTrapOptions>(() => {
    return {
      autoFocus,
    }
  }, [autoFocus])

  useEffect(() => {
    if (instance.current) {
      instance.current.setOptions(trapOptions)
    }
  }, [trapOptions])

  useLayoutEffect(() => {
    if (ref.current === scopeRef.current) {
      return
    }

    ref.current = scopeRef.current

    if (instance.current) {
      instance.current.deactivate()
      instance.current = null
    }

    if (ref.current) {
      instance.current = createFocusTrap(ref.current, trapOptions)

      if (enabled) {
        instance.current.activate()
      }
    }
  })

  useLayoutEffect(() => {
    if (!enabled || !instance.current) {
      return
    }

    instance.current.activate()

    return () => {
      instance.current?.deactivate()
    }
  }, [enabled])

  useRestoreFocus({ enabled: enabled && restoreFocus, restoreFocusRef })
}

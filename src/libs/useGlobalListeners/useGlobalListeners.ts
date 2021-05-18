import { useCallback, useEffect, useRef } from 'react'

/* eslint-disable no-undef */
interface UseGlobalListenersResult {
  addGlobalListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
  addGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void
  removeGlobalListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void
  removeGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void
  removeAllGlobalListeners(): void
}
/* eslint-enable no-undef */

export function useGlobalListeners(): UseGlobalListenersResult {
  const globalListeners = useRef(new Map())

  const addGlobalListener = useCallback((eventTarget, type, listener, options) => {
    globalListeners.current.set(listener, { type, eventTarget, options })
    eventTarget.addEventListener(type, listener, options)
  }, [])

  const removeGlobalListener = useCallback((eventTarget, type, listener, options) => {
    eventTarget.removeEventListener(type, listener, options)
    globalListeners.current.delete(listener)
  }, [])

  const removeAllGlobalListeners = useCallback(() => {
    globalListeners.current.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options)
    })
  }, [removeGlobalListener])

  useEffect(() => {
    return removeAllGlobalListeners
  }, [removeAllGlobalListeners])

  return { addGlobalListener, removeGlobalListener, removeAllGlobalListeners }
}

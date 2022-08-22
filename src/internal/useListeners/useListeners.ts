import { useCallback, useEffect, useRef } from 'react'

/* eslint-disable no-undef */
interface UseListenersResult {
  addListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
  addListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void
  removeListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void
  removeListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void
  removeAllListeners(): void
}
/* eslint-enable no-undef */

export function useListeners(): UseListenersResult {
  const globalListeners = useRef(new Map())

  /* eslint-disable no-undef */
  const addListener = useCallback(
    (
      eventTarget: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => {
      /* eslint-enable no-undef */
      globalListeners.current.set(listener, { type, eventTarget, options })
      eventTarget.addEventListener(type, listener, options)
    },
    [],
  )

  /* eslint-disable no-undef */
  const removeListener = useCallback(
    (
      eventTarget: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => {
      /* eslint-enable no-undef */
      eventTarget.removeEventListener(type, listener, options)
      globalListeners.current.delete(listener)
    },
    [],
  )

  const removeAllListeners = useCallback(() => {
    globalListeners.current.forEach((value, key) => {
      removeListener(value.eventTarget, value.type, key, value.options)
    })
  }, [removeListener])

  useEffect(() => {
    return removeAllListeners
  }, [removeAllListeners])

  return { addListener, removeListener, removeAllListeners }
}

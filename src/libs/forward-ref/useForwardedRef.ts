import { ForwardedRef, RefObject, useImperativeHandle } from 'react'

/**
 * Copies forwarded ref to mutable ref object.
 *
 * @example
 * const Component = forwardRef<HTMLDivElement>((_, forwardedRef) => {
 *   const ref = useRef<HTMLDivElement>(null)
 *   useForwardedRef(ref, forwardedRef)
 *
 *   return <div ref={ref} />
 * })
 */
export function useForwardedRef<T>(ref: RefObject<T>, forwardedRef: ForwardedRef<T>): void {
  useImperativeHandle<T | null, T | null>(forwardedRef, () => ref.current)
}

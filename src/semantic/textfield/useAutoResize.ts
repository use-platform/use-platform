import { RefObject } from 'react'

import { useIsomorphicLayoutEffect } from '../../libs/isomorphic-layout-effect'
import type { InputValueProps } from '../../shared/types/input'

export interface UseAutoResizeProps
  extends InputValueProps<string | ReadonlyArray<string> | number> {
  /**
   * Enable auto resize.
   */
  enabled: boolean
}

/**
 * Enable auto resize textarea when text changed.
 *
 * @param props - Props for the auto resize.
 * @param inputRef - Ref to the textarea html element.
 */
export function useAutoResize(
  props: UseAutoResizeProps,
  inputRef: RefObject<HTMLTextAreaElement>,
): void {
  const { value, enabled } = props

  useIsomorphicLayoutEffect(() => {
    if (inputRef.current && enabled) {
      const input = inputRef.current
      input.style.height = 'auto'
      input.style.height = `${input.scrollHeight}px`
    }
  }, [inputRef, value, enabled])
}

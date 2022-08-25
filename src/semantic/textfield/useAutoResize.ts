import { RefObject } from 'react'

import { useIsomorphicLayoutEffect } from '../../libs/isomorphic-layout-effect'
import { clamp } from '../../libs/utils'
import type { InputValueProps } from '../../shared/types/input'

export interface UseAutoResizeProps
  extends InputValueProps<string | ReadonlyArray<string> | number> {
  /**
   * Enable auto resize.
   */
  enabled: boolean
  /**
   * @default 1
   */
  minRows?: number
  /**
   * @default Infinity
   */
  maxRows?: number
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

  const minRows = Math.max(props.minRows || 1, 1)
  const maxRows = clamp(props.maxRows || Infinity, minRows, Infinity)

  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current

    if (input) {
      input.rows = minRows

      if (!enabled) {
        return
      }

      for (let rows = minRows + 1; rows <= maxRows; rows++) {
        if (input.scrollHeight <= input.clientHeight) {
          break
        }

        input.rows = rows
      }
    }
  }, [inputRef, value, enabled])
}

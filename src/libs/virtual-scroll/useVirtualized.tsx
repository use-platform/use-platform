import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { useVirtual } from 'react-virtual'

import { UseVirtualizedProps, UseVirtualizedResult } from './types'

export function useVirtualized<T, U extends HTMLElement = HTMLDivElement>(
  props: UseVirtualizedProps<T>,
): UseVirtualizedResult<U> {
  const { estimate, items, renderElement, focusedIndex = null } = props
  const containerRef = useRef<U>(null)
  const estimateSize = useCallback(
    (index: number) => {
      return typeof estimate === 'number' ? estimate : estimate(items[index])
    },
    [estimate, items],
  )

  const virtualizer = useVirtual({
    size: items.length,
    parentRef: containerRef,
    estimateSize,
  })

  useEffect(() => {
    if (focusedIndex !== null) {
      virtualizer.scrollToIndex(focusedIndex, { align: 'auto' })
    }
  }, [focusedIndex, virtualizer, items.length, estimate])

  return {
    innerProps: {
      style: {
        position: 'relative',
        height: virtualizer.totalSize,
      },
    },
    containerProps: {
      style: {
        overflowY: 'auto',
      },
      ref: containerRef,
    },
    virtualItems: virtualizer.virtualItems.map((item) => (
      <Fragment key={item.key}>
        {renderElement({
          element: items[item.index],
          style: {
            transform: `translateY(${item.start}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        })}
      </Fragment>
    )),
  }
}

import React from 'react'

import { VirtualCollectionProps } from './types'
import { useVirtualized } from './useVirtualized'

export function VirtualCollection<T = unknown>(props: VirtualCollectionProps<T>) {
  const { collection, children, estimate, focusedIndex } = props
  const { containerProps, innerProps, virtualItems } = useVirtualized<T>({
    items: collection,
    renderElement: ({ element, style }) => (
      <div style={style}>{children({ element: element })}</div>
    ),
    estimate,
    focusedIndex,
  })

  return (
    <div
      ref={containerProps.ref}
      style={{ ...containerProps.style, height: props.height, maxHeight: props.maxHeight }}
    >
      <div style={innerProps.style}>{virtualItems}</div>
    </div>
  )
}

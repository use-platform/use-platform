import { VirtualCollection } from '@use-platform/react'
import { useMemo } from 'react'

interface Args {
  estimate: number
  focusedIndex: number
  height?: number
  maxHeight?: number
}

interface DummyItem {
  text: string
}

export const VirtualizationComponent = ({ estimate, focusedIndex, maxHeight, height }: Args) => {
  const collection = useMemo(
    () =>
      new Array(100)
        .fill(null)
        .map<DummyItem>((_, index) => ({ text: `Item with index ${index}` })),
    [],
  )

  return (
    <VirtualCollection<DummyItem> {...{ collection, estimate, focusedIndex, maxHeight, height }}>
      {(item) => (
        <div style={{ height: estimate, display: 'flex', alignItems: 'center' }}>
          {item.element.text}
        </div>
      )}
    </VirtualCollection>
  )
}

VirtualizationComponent.args = {
  estimate: 18,
  focusedIndex: 0,
  maxHeight: 200,
}

import { Key, useCallback, useRef, useState } from 'react'

export type SelectionMode = 'none' | 'single' | 'multiple'

export interface UseSelectionStateProps {
  defaultSelectedKeys?: Key[]
  selectionMode: SelectionMode
  disallowEmptySelection?: boolean
  onSelectionChange?: (keys: Set<Key>) => void
}

export interface UseSelectionStateResult {
  selectedKeys: Set<Key>
  isSelected: (key: Key) => boolean
  select: (key: Key) => void
}

/**
 * Manages state for single and multiple selection.
 *
 * @example
 * const Component = (props) => {
 *   const selectionState = useSelectionState({
 *      selectionMode: 'multiple',
 *      defaultSelectedKeys: ['a', 'b'],
 *      onSelectionChange: (keys) => {
 *         // ...
 *      },
 *   });
 * })
 */
export function useSelectionState(props: UseSelectionStateProps): UseSelectionStateResult {
  const {
    defaultSelectedKeys,
    onSelectionChange,
    selectionMode,
    disallowEmptySelection = false,
  } = props
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(() => new Set(defaultSelectedKeys))
  const onSelectionChangeRef = useRef(onSelectionChange)

  const select = useCallback(
    (key: Key) => {
      const isExists = selectedKeys.has(key)

      if (
        selectionMode === 'none' ||
        (isExists && disallowEmptySelection && selectedKeys.size === 1)
      ) {
        return
      }

      const keys = new Set(selectedKeys)
      if (isExists) {
        keys.delete(key)
      } else {
        if (selectionMode === 'single') {
          keys.clear()
        }

        keys.add(key)
      }

      setSelectedKeys(keys)
      onSelectionChangeRef.current?.(keys)
    },
    [selectedKeys, selectionMode, disallowEmptySelection],
  )

  const isSelected = useCallback((key: Key) => selectedKeys.has(key), [selectedKeys])

  return {
    selectedKeys,
    isSelected,
    select,
  }
}

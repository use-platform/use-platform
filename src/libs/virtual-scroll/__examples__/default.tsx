import { useCallback } from '@storybook/addons'
import { RenderElementProps, useVirtualized } from '@yandex/web-platform'
import { useMemo } from 'react'

interface DummyItem {
  text: string
}

interface Args {
  estimate: number
  focusedIndex: number
}

export const Default = ({ estimate, focusedIndex }: Args) => {
  const items = useMemo(
    () =>
      new Array(100)
        .fill(null)
        .map<DummyItem>((_, index) => ({ text: `Item with index ${index}` })),
    [],
  )
  const {
    containerProps,
    innerProps,
    virtualItems: children,
  } = useVirtualized({
    items,
    renderElement: useCallback(
      ({ element, style }: RenderElementProps<DummyItem>) => (
        <li style={{ ...style, height: estimate, display: 'flex', alignItems: 'center' }}>
          {element.text}
        </li>
      ),
      [estimate],
    ),
    estimate,
    focusedIndex,
  })

  return (
    <div {...containerProps} style={{ ...containerProps.style, maxHeight: 200 }}>
      <ul {...innerProps} style={{ marginTop: 0, ...innerProps.style }}>
        {children}
      </ul>
    </div>
  )
}

Default.args = {
  estimate: 18,
  focusedIndex: 0,
}

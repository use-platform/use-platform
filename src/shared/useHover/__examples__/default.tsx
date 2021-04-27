import { useHover } from '@yandex/web-platform/shared/useHover'

export const Default = () => {
  const { isHovered, hoverProps } = useHover({})

  return <div {...hoverProps}>{isHovered ? 'hovered' : 'idle'}</div>
}

import { HTMLAttributes, useMemo, useState } from 'react'

export interface UseHoverProps {
  disabled?: boolean
}

export interface UseHoverResult {
  isHovered: boolean
  hoverProps: HTMLAttributes<HTMLElement>
}

export function useHover(props: UseHoverProps): UseHoverResult {
  const { disabled } = props
  const [isHovered, setHovered] = useState(false)

  const hoverProps = useMemo(() => {
    const props: HTMLAttributes<HTMLElement> = {}

    if (disabled) {
      return props
    }

    if (typeof PointerEvent !== 'undefined') {
      props.onPointerEnter = () => setHovered(true)
      props.onPointerLeave = () => setHovered(false)
    } else {
      props.onMouseEnter = () => setHovered(true)
      props.onMouseLeave = () => setHovered(false)
    }

    return props
  }, [disabled])

  return {
    isHovered,
    hoverProps,
  }
}

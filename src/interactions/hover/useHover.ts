import { HTMLAttributes, useMemo, useRef, useState } from 'react'

export interface UseHoverProps {
  disabled?: boolean
}

export interface UseHoverResult {
  isHovered: boolean
  hoverProps: HTMLAttributes<HTMLElement>
}

export function useHover(props: UseHoverProps): UseHoverResult {
  const [isHovered, setHovered] = useState(false)
  const propsRef = useRef<UseHoverProps>({})
  // Use ref as cache for reuse props inside memo hook.
  propsRef.current = { disabled: props.disabled }

  const hoverProps = useMemo(() => {
    const props: HTMLAttributes<HTMLElement> = {}

    props.onPointerEnter = (event) => {
      const { disabled } = propsRef.current

      if (disabled || event.pointerType !== 'mouse') {
        return
      }

      setHovered(true)
    }

    props.onPointerLeave = () => {
      setHovered(false)
    }

    return props
  }, [])

  return {
    isHovered,
    hoverProps,
  }
}

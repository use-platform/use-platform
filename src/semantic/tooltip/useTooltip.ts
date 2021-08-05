import { HTMLAttributes } from 'react'

import { useHover } from '../../interactions/hover'
import { CommonTooltipProps } from './types'

interface UseTooltipResult {
  isVisible: boolean
  targetProps: HTMLAttributes<HTMLElement>
  tooltipProps: HTMLAttributes<HTMLElement>
}

export function useTooltip(props: CommonTooltipProps): UseTooltipResult {
  const { isHovered, hoverProps } = useHover(props)
  const uniqId = '11'

  return {
    isVisible: isHovered,
    targetProps: {
      ...hoverProps,
      'aria-describedby': uniqId,
    },
    tooltipProps: {
      id: uniqId,
      'aria-hidden': !isHovered,
      role: 'tooltip',
    },
  }
}

import { useUniqId } from '@yandex/web-platform/libs/uniq-id'
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
  const id = useUniqId(props.tooltipId)

  return {
    isVisible: isHovered,
    targetProps: {
      ...hoverProps,
      'aria-describedby': id,
    },
    tooltipProps: {
      id,
      'aria-hidden': !isHovered,
      role: 'tooltip',
    },
  }
}

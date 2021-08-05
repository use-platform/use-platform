import React, { FC, ReactElement } from 'react'
import { CommonTooltipProps } from '@yandex/web-platform'
import { useTooltip } from '../useTooltip'

export const Default = (args: any) => {
  return (
    <Tooltip {...args}>
      <span>Hover me</span>
    </Tooltip>
  )
}

Default.args = {
  content: 'Tooltip content',
  disabled: false,
} as CommonTooltipProps

interface TooltipProps extends CommonTooltipProps {
  content?: string
  children: ReactElement
}

const Tooltip: FC<TooltipProps> = (props) => {
  const { disabled, content, children } = props
  const { isVisible, targetProps, tooltipProps } = useTooltip({ disabled })

  return (
    <div style={{ position: 'relative' }}>
      {React.cloneElement(children, targetProps)}
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: '105%',
          background: '#adadad',
          padding: '10px',
          boxSizing: 'border-box',
          visibility: isVisible ? 'visible' : 'hidden',
        }}
        {...tooltipProps}
      >
        {content}
      </span>
    </div>
  )
}

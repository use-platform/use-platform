import { Story } from '@storybook/react'
import { useHover } from '@use-platform/react'
import { CSSProperties } from 'react'

const style: CSSProperties = {
  width: '100px',
  height: '36px',
  backgroundColor: '#ccc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
}

export const Default: Story = (props) => {
  const { isHovered, hoverProps } = useHover(props)

  return (
    <div {...hoverProps} style={style}>
      {isHovered ? 'hovered' : 'idle'}
    </div>
  )
}

Default.args = {
  disabled: false,
}

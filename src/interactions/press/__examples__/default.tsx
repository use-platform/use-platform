import { CSSProperties } from 'react'
import { Story } from '@storybook/react'
import { usePress } from '@yandex/web-platform'

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
  const { pressed, pressProps } = usePress(props)

  return (
    <div {...pressProps} tabIndex={0} style={style}>
      {pressed ? 'pressed' : 'idle'}
    </div>
  )
}

Default.argTypes = {
  onPress: { action: 'press' },
  onPressStart: { action: 'press start' },
  onPressEnd: { action: 'press end' },
  onPressUp: { action: 'press up' },
}

Default.args = {
  disabled: false,
}

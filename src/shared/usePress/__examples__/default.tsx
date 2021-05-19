import { CSSProperties } from 'react'
import { usePress } from '@yandex/web-platform/shared/usePress'

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

export const Default = () => {
  const { pressed, pressProps } = usePress({})

  return (
    <div {...pressProps} tabIndex={0} style={style}>
      {pressed ? 'pressed' : 'idle'}
    </div>
  )
}

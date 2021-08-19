import { CSSProperties, useState } from 'react'
import { Story } from '@storybook/react'
import { useFocusWithin, UseFocusWithinProps } from '@yandex/web-platform'

export const FocusWithin: Story<UseFocusWithinProps> = (props) => {
  const [isFocusWithin, onFocusChange] = useState(false)
  const { focusWithinProps } = useFocusWithin({
    ...props,
    onFocusWithinChange: (v) => {
      onFocusChange(v)
      props.onFocusWithinChange?.(v)
    },
  })

  const style: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    border: '2px solid',
    borderColor: '#d9d9d9',
    padding: '8px',
  }

  if (isFocusWithin) {
    style.borderColor = '#0679ff'
  }

  return (
    <>
      {isFocusWithin ? 'focus-within' : 'idle'}
      <div {...focusWithinProps} style={style}>
        <input placeholder="click me" />
      </div>
    </>
  )
}

FocusWithin.args = {
  disabled: false,
}

FocusWithin.argTypes = {
  onFocusWithin: { action: 'focus within' },
  onBlurWithin: { action: 'blur within' },
  onFocusWithinChange: { action: 'focus within change' },
}

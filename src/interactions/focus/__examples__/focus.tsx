import { Story } from '@storybook/react'
import { UseFocusProps, useFocus } from '@use-platform/react'
import { CSSProperties, useState } from 'react'

export const Focus: Story<UseFocusProps> = (props) => {
  const [isFocused, onFocusChange] = useState(false)
  const { focusProps } = useFocus({
    ...props,
    onFocusChange: (v) => {
      onFocusChange(v)
      props.onFocusChange?.(v)
    },
  })

  const style: CSSProperties = {
    border: '2px solid',
    borderColor: '#d9d9d9',
    padding: '8px',
  }

  if (isFocused) {
    style.borderColor = '#b3b3b3'
  }

  return (
    <>
      {isFocused ? 'focused' : 'idle'}
      <div {...focusProps} tabIndex={-1} style={style}>
        click me
      </div>
    </>
  )
}

Focus.args = {
  disabled: false,
}

Focus.argTypes = {
  onFocus: { action: 'focus' },
  onBlur: { action: 'blur' },
  onFocusChange: { action: 'focus change' },
}

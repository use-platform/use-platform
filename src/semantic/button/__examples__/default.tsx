import { FC, useRef } from 'react'
import { useButton, useHover } from '@yandex/web-platform'

export const Default = (args: any) => {
  return <Button {...args} />
}

Default.argTypes = {
  as: {
    control: {
      type: 'radio',
      options: ['button', 'a', 'div'],
    },
  },
}

Default.args = {
  as: 'button',
  href: '',
  disabled: false,
}

const Button: FC<any> = (props) => {
  const ref = useRef(null)
  const { ElementType, isPressed, buttonProps } = useButton(props, ref)
  const { isHovered, hoverProps } = useHover(props)

  return (
    <ElementType {...buttonProps} {...hoverProps} ref={ref}>
      {isPressed ? 'pressed' : 'idle'} {isHovered ? 'hovered' : 'idle'}
    </ElementType>
  )
}

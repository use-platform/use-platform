import { ButtonBaseProps, ElementTypeProps, useButton, useHover } from '@yandex/web-platform'
import { FC, useRef } from 'react'

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

type ButtonProps = ButtonBaseProps & ElementTypeProps

const Button: FC<ButtonProps> = (props) => {
  const ref = useRef(null)
  const { as: ElementType = 'button' } = props
  const { isPressed, buttonProps } = useButton(props, ref)
  const { isHovered, hoverProps } = useHover(props)

  return (
    <ElementType {...buttonProps} {...hoverProps} ref={ref}>
      {isPressed ? 'pressed' : 'idle'} {isHovered ? 'hovered' : 'idle'}
    </ElementType>
  )
}

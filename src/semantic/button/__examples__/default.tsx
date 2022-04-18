import {
  ButtonBaseProps,
  ElementTypeProps,
  mergeProps,
  useButton,
  useHover,
} from '@use-platform/react'
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
  const { as: ElementType = 'button', ...otherProps } = props
  const elementType = typeof ElementType === 'string' ? ElementType : 'button'
  const { isPressed, buttonProps } = useButton({ ...otherProps, elementType }, ref)
  const { isHovered, hoverProps } = useHover(props)

  return (
    <ElementType {...mergeProps(buttonProps, hoverProps)} ref={ref}>
      {isPressed ? 'pressed' : 'idle'} {isHovered ? 'hovered' : 'idle'}
    </ElementType>
  )
}

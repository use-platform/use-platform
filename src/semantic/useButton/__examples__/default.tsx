import { FC, useRef } from 'react'
import { useButton } from '@yandex/web-platform/semantic/useButton'

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

const Button: FC = (props) => {
  const ref = useRef(null)
  const { ElementType, hovered, pressed, buttonProps } = useButton(props, ref)

  return (
    <ElementType {...buttonProps} ref={ref}>
      {pressed ? 'pressed' : 'idle'} {hovered ? 'hovered' : 'idle'}
    </ElementType>
  )
}

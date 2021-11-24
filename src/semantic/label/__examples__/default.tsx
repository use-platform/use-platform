import { useLabel } from '@yandex/web-platform'
import { ElementType, FC } from 'react'

interface DefaultArgs {
  id?: string
  behavior: ElementType
}

const LabelledInput: FC<DefaultArgs> = (props) => {
  const { labelProps, fieldProps } = useLabel({
    ...props,
    behavior: props.behavior === 'label' ? 'label' : undefined,
  })
  const { behavior: ElementTag } = props

  return (
    <div>
      <ElementTag style={{ marginRight: '1em' }} {...labelProps}>
        Label
      </ElementTag>
      <input type="text" name="input" {...fieldProps} />
    </div>
  )
}

export const Default = (args: DefaultArgs) => <LabelledInput {...args} />

Default.args = {
  behavior: 'span',
  id: '',
}

Default.argTypes = {
  behavior: {
    options: ['label', 'span'],
    control: { type: 'select' },
  },
}

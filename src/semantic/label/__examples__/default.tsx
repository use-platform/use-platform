import { Story } from '@storybook/react'
import { useLabel } from '@use-platform/react'
import { ElementType, FC } from 'react'

interface DefaultArgs {
  id?: string
  as: ElementType
}

const LabelledInput: FC<DefaultArgs> = (props) => {
  const { as: ElementType } = props
  const { labelProps, fieldProps } = useLabel(props)

  return (
    <div>
      <ElementType style={{ marginRight: '1em' }} {...labelProps}>
        Label
      </ElementType>
      <input type="text" name="input" {...fieldProps} />
    </div>
  )
}

export const Default: Story<DefaultArgs> = (args) => <LabelledInput {...args} />

Default.args = {
  id: '',
}

Default.argTypes = {
  as: {
    options: ['label', 'span'],
    control: { type: 'select' },
    defaultValue: 'label',
  },
}

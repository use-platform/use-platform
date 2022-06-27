import { mergeProps, useLabel } from '@use-platform/react'
import { VFC } from 'react'

const MultipleLabelledComponent: VFC = () => {
  const label1 = useLabel({ id: 'foo' })
  const label2 = useLabel({ id: 'foo' })

  return (
    <div>
      <span {...label1.labelProps}>First label,&nbsp;</span>
      <label {...label2.labelProps} style={{ marginRight: '1em' }}>
        second label
      </label>
      <input type="text" name="input" {...mergeProps(label1.fieldProps, label2.fieldProps)} />
    </div>
  )
}

export const MultipleLabels = () => <MultipleLabelledComponent />

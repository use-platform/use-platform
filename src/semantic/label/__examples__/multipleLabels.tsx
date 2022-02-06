import { mergeProps, useLabel } from '@use-platform/react'
import { VFC } from 'react'

const MultipleLabelledComponent: VFC = () => {
  const id = 'foo'
  const { labelProps: firstLabelProps, fieldProps: firstLabelInputProps } = useLabel({ id })
  const { labelProps: secondLabelProps, fieldProps: secondLabelInputProps } = useLabel({
    id,
    behavior: 'label',
  })

  return (
    <div>
      <span {...firstLabelProps}>First label,&nbsp;</span>
      <label {...secondLabelProps} style={{ marginRight: '1em' }}>
        second label
      </label>
      <input
        type="text"
        name="input"
        {...mergeProps(firstLabelInputProps, secondLabelInputProps)}
      />
    </div>
  )
}

export const MultipleLabels = () => <MultipleLabelledComponent />

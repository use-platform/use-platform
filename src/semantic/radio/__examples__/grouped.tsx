import { ChangeEvent, FC, useCallback, useState } from 'react'

import {
  RadioGroupContext,
  UseRadioGroupProps,
  useRadioGroup,
  useRadioGroupState,
} from '@yandex/web-platform'
import { CommonRadioArgs } from './types'
import { Radio } from './radio'

interface GroupedRadioArgs extends CommonRadioArgs {
  disabled: boolean
  readOnly: boolean
}

export const GroupedRadios = (args: GroupedRadioArgs) => {
  const { value, firstRadioDisabled, secondRadioDisabled, thirdRadioDisabled, ...restArgs } = args
  const [selected, setSelected] = useState(value)
  const [oldArgsValue, setOldArgsValue] = useState(value)
  if (value !== oldArgsValue) {
    setOldArgsValue(value)
    setSelected(value)
  }
  const valueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value)
  }, [])
  return (
    <RadioGroup value={selected} onChange={valueChanged} {...restArgs}>
      <Radio value="foo" disabled={firstRadioDisabled}>
        foo
      </Radio>
      <Radio value="bar" disabled={secondRadioDisabled}>
        bar
      </Radio>
      <Radio value="baz" disabled={thirdRadioDisabled}>
        baz
      </Radio>
    </RadioGroup>
  )
}

GroupedRadios.args = {
  value: 'foo',
  disabled: false,
  readOnly: false,
  firstRadioDisabled: false,
  secondRadioDisabled: false,
  thirdRadioDisabled: false,
}

GroupedRadios.argTypes = {
  value: {
    options: ['foo', 'bar', 'baz'],
    control: { type: 'select' },
  },
}

const RadioGroup: FC<UseRadioGroupProps> = (props) => {
  const { children, value, disabled, onChange, readOnly, ...restProps } = props
  const state = useRadioGroupState({ value, disabled, onChange, readOnly })
  const { rootProps } = useRadioGroup(restProps)
  return (
    <RadioGroupContext.Provider value={state}>
      <div {...rootProps}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

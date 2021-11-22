import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'

import {
  BaseRadioProps,
  RadioGroupContext,
  useRadio,
  UseRadioGroupProps,
  useRadioGroup,
  useRadioGroupState,
} from '@yandex/web-platform'

interface GroupedRadioArgs {
  firstRadioDisabled: boolean
  secondRadioDisabled: boolean
  thirdRadioDisabled: boolean
  value: string
  disabled: boolean
  readOnly: boolean
  firstRadioReadonly: boolean
  secondRadioReadonly: boolean
  thirdRadioReadonly: boolean
}

const Radio: FC<BaseRadioProps> = (props) => {
  const { children, ...restProps } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps, rootProps, isPressed } = useRadio(restProps, inputRef)
  return (
    <label {...rootProps} style={{ opacity: isPressed || props.disabled ? 0.5 : 1 }}>
      <input {...inputProps} ref={inputRef} />
      {children}
    </label>
  )
}

export const GroupedRadios = (args: GroupedRadioArgs) => {
  const {
    value,
    firstRadioDisabled,
    secondRadioDisabled,
    thirdRadioDisabled,
    firstRadioReadonly,
    secondRadioReadonly,
    thirdRadioReadonly,
    ...restArgs
  } = args
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
      <Radio value="foo" disabled={firstRadioDisabled} readOnly={firstRadioReadonly}>
        foo
      </Radio>
      <Radio value="bar" disabled={secondRadioDisabled} readOnly={secondRadioReadonly}>
        bar
      </Radio>
      <Radio value="baz" disabled={thirdRadioDisabled} readOnly={thirdRadioReadonly}>
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
  firstRadioReadonly: false,
  secondRadioReadonly: false,
  thirdRadioReadonly: false,
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

import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'
import { RadioGroupContext } from '../RadioGroupContext'
import { RadioProps, UseRadioGroupProps } from '../types'
import { useRadio } from '../useRadio'
import { useRadioGroup } from '../useRadioGroup'
import { useRadioGroupState } from '../useRadioGroupState'

interface CommonRadioArgs {
  firstRadioDisabled: boolean
  secondRadioDisabled: boolean
  thirdRadioDisabled: boolean
  value: string
}

interface StandaloneRadioArgs extends CommonRadioArgs {
  firstRadioReadonly: boolean
  secondRadioReadonly: boolean
  thirdRadioReadonly: boolean
}

interface GroupedRadioArgs extends StandaloneRadioArgs {
  disabled: boolean
  readOnly: boolean
}

export const StandaloneRadios = (args: StandaloneRadioArgs) => {
  const [selected, setSelected] = useState(args.value)
  const useOnChange = (value: string) => () => setSelected(value)
  return (
    <>
      <Radio
        disabled={args.firstRadioDisabled}
        readOnly={args.firstRadioReadonly}
        checked={selected === 'foo'}
        value="foo"
        name="testinput"
        onChange={useOnChange('foo')}
      >
        foo
      </Radio>
      <Radio
        disabled={args.secondRadioDisabled}
        checked={selected === 'bar'}
        readOnly={args.secondRadioReadonly}
        value="bar"
        name="testinput"
        onChange={useOnChange('bar')}
      >
        bar
      </Radio>
      <Radio
        disabled={args.thirdRadioDisabled}
        checked={selected === 'baz'}
        readOnly={args.thirdRadioReadonly}
        value="baz"
        name="testinput"
        onChange={useOnChange('baz')}
      >
        baz
      </Radio>
    </>
  )
}

export const GroupedRadios = (args: GroupedRadioArgs) => {
  const { value, firstRadioDisabled, secondRadioDisabled, thirdRadioDisabled, ...restArgs } = args
  const [selected, setSelected] = useState(value)
  const valueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelected(event.currentTarget.value)
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

StandaloneRadios.args = {
  value: 'foo',
  firstRadioDisabled: false,
  secondRadioDisabled: false,
  thirdRadioDisabled: false,
  firstRadioReadonly: false,
  secondRadioReadonly: false,
  thirdRadioReadonly: false,
}

GroupedRadios.args = {
  value: 'foo',
  disabled: false,
  readOnly: false,
  firstRadioDisabled: false,
  secondRadioDisabled: false,
  thirdRadioDisabled: false,
}

const Radio: FC<RadioProps> = (props) => {
  const { children, ...restProps } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps } = useRadio(restProps, inputRef)
  return (
    <label>
      <input {...inputProps} ref={inputRef} />
      {children}
    </label>
  )
}

const RadioGroup: FC<UseRadioGroupProps> = (props) => {
  const { children, value, disabled, readOnly, ...restProps } = props
  const state = useRadioGroupState({ value, disabled, readOnly })
  const { rootProps } = useRadioGroup(restProps)
  return (
    <RadioGroupContext.Provider value={state}>
      <div {...rootProps}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

import { FC, ChangeEvent, useCallback, useRef, useState } from 'react'

import { BaseRadioProps, useRadio } from '@yandex/web-platform'

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

interface StandaloneRadioArgs {
  firstRadioDisabled: boolean
  secondRadioDisabled: boolean
  thirdRadioDisabled: boolean
  value: string
  firstRadioReadonly: boolean
  secondRadioReadonly: boolean
  thirdRadioReadonly: boolean
}

export const StandaloneRadios = (args: StandaloneRadioArgs) => {
  const [selected, setSelected] = useState(args.value)
  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSelected(event.target.value),
    [],
  )
  const [oldArgsValue, setOldArgsValue] = useState(args.value)
  if (args.value !== oldArgsValue) {
    setOldArgsValue(args.value)
    setSelected(args.value)
  }
  return (
    <>
      <Radio
        disabled={args.firstRadioDisabled}
        readOnly={args.firstRadioReadonly}
        checked={selected === 'foo'}
        value="foo"
        name="testinput"
        onChange={handleOnChange}
      >
        foo
      </Radio>
      <Radio
        disabled={args.secondRadioDisabled}
        checked={selected === 'bar'}
        readOnly={args.secondRadioReadonly}
        value="bar"
        name="testinput"
        onChange={handleOnChange}
      >
        bar
      </Radio>
      <Radio
        disabled={args.thirdRadioDisabled}
        checked={selected === 'baz'}
        readOnly={args.thirdRadioReadonly}
        value="baz"
        name="testinput"
        onChange={handleOnChange}
      >
        baz
      </Radio>
    </>
  )
}

StandaloneRadios.argTypes = {
  value: {
    options: ['foo', 'bar', 'baz'],
    control: { type: 'select' },
  },
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

import { useState } from 'react'

import { CommonRadioArgs } from './types'
import { Radio } from './radio'

interface StandaloneRadioArgs extends CommonRadioArgs {
  firstRadioReadonly: boolean
  secondRadioReadonly: boolean
  thirdRadioReadonly: boolean
}

export const StandaloneRadios = (args: StandaloneRadioArgs) => {
  const [selected, setSelected] = useState(args.value)
  const useOnChange = (value: string) => () => setSelected(value)
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

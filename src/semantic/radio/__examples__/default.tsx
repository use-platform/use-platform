import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'

import { BaseRadioProps, mergeProps, useRadio } from '@yandex/web-platform'

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

interface DefaultRadioArgs {
  disabled: boolean
  checked: boolean
  readOnly: boolean
  value: string
  name: string
}

export const Default = (args: DefaultRadioArgs) => {
  const [checked, setChecked] = useState(args.checked)
  const [oldArgsChecked, setOldArgsChecked] = useState(args.checked)

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }, [])

  if (args.checked !== oldArgsChecked) {
    setOldArgsChecked(args.checked)
    setChecked(args.checked)
  }

  return <Radio {...mergeProps(args, { checked, onChange: handleOnChange })}>Radio</Radio>
}

Default.args = {
  disabled: false,
  checked: false,
  readOnly: false,
  value: 'foo',
  name: 'radio',
}

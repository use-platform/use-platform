import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'
import { SwitchBaseProps, useSwitch } from '@yandex/web-platform'

export const Default = (args: SwitchBaseProps) => {
  const [checked, setChecked] = useState(false)
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }, [])

  return <Switch {...args} checked={checked} onChange={onChange} />
}

Default.args = {
  disabled: false,
  readOnly: false,
  required: false,
  name: 'switch',
  value: 'value',
  autoFocus: false,
} as SwitchBaseProps

const Switch: FC<SwitchBaseProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isPressed, rootProps, inputProps } = useSwitch(props, inputRef)

  return (
    <label
      {...rootProps}
      style={{
        display: 'inline-flex',
        position: 'relative',
        opacity: isPressed || props.disabled ? 0.5 : 1,
      }}
    >
      <input
        ref={inputRef}
        {...inputProps}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          margin: '0',
          opacity: 0,
        }}
      />
      <div
        style={{
          height: '20px',
          width: '38px',
          backgroundColor: props.checked ? '#FFDB4D' : '#f1f2f5',
          display: 'inline-flex',
          padding: '2px',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#fff',
            transform: props.checked ? 'translateX(18px)' : '',
          }}
        />
      </div>
    </label>
  )
}

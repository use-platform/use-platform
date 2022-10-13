import { TextFieldProps, useTextField } from '@use-platform/react'
import { ChangeEvent, FC, RefObject, useCallback, useRef, useState } from 'react'

import * as ScrollLocker from '..'

export const Default = (args: any) => {
  const [value, setValue] = useState('Text')
  const inputRef = useRef<any>(null)

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  lockElement(args.lock, inputRef)

  return args.type === 'textarea' ? (
    <TextField value={value} inputRef={inputRef} onChange={onChange} />
  ) : (
    <BaseElement inputRef={inputRef} value={value} />
  )
}

Default.argTypes = {
  type: {
    control: {
      type: 'radio',
      options: ['textarea', 'baseElement'],
    },
  },
}

Default.args = {
  lock: false,
  type: 'textarea',
}

interface TextFieldRefProps extends TextFieldProps {
  onChange: () => void
  inputRef: RefObject<any>
  value: string
}

const lockElement = (lock: boolean, ref: RefObject<any>) => {
  if (lock) {
    ScrollLocker.lock(ref.current)
  } else {
    ScrollLocker.unlock(ref.current)
  }
}

const BaseElement: FC<any> = (props: any) => {
  const { value, inputRef } = props

  return (
    <div
      style={{ border: '2px solid black', height: '100px', width: '250px', overflow: 'scroll' }}
      ref={inputRef}
    >
      <div style={{ height: '200px' }}>{value}</div>
    </div>
  )
}

const TextField: FC<any> = (props: TextFieldRefProps) => {
  const { value, onChange, inputRef } = props
  const { inputProps } = useTextField({ elementType: 'textarea' }, inputRef)

  return <textarea {...inputProps} value={value} ref={inputRef} onChange={onChange} />
}

import { useAutoResize, useTextField } from '@use-platform/react'
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'

export const Textarea = (args: any) => {
  const [value, setValue] = useState('')
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }, [])

  return <TextField {...args} value={value} onChange={onChange} />
}

Textarea.args = {
  autoFocus: false,
  autoResize: false,
  cols: 0,
  rows: 0,
}

const TextField: FC<any> = (props) => {
  const { autoResize, ...restProps } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { inputProps } = useTextField({ as: 'textarea', ...restProps }, inputRef)
  useAutoResize({ enabled: autoResize, ...restProps }, inputRef)

  return (
    <div style={{ display: 'flex' }}>
      <textarea {...inputProps} ref={inputRef} />
    </div>
  )
}

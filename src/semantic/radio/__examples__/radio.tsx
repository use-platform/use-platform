import { FC, useRef } from 'react'

import { RadioProps, useRadio } from '@yandex/web-platform'

export const Radio: FC<RadioProps> = (props) => {
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

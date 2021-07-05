import { FC, useRef } from 'react'

import { createClientRender, screen } from '../../libs/testing'
import { useSwitch } from './useSwitch'

const Switch: FC<any> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps } = useSwitch(props, inputRef)

  return <input {...inputProps} ref={inputRef} data-testid="switch" />
}

describe('useSwitch', () => {
  const render = createClientRender()

  test('should set correct role', () => {
    render(<Switch />)
    expect(screen.getByTestId('switch')).toHaveAttribute('role', 'switch')
  })
})

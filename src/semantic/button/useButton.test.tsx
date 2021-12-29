import { FC, useRef } from 'react'

import { createClientRender } from '../../libs/testing'
import { ButtonBaseProps, useButton } from './index'

const Button: FC<ButtonBaseProps> = (props) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)

  return <button {...buttonProps} ref={ref} data-testid="button" />
}

describe('useButton', () => {
  const render = createClientRender()

  beforeEach(() => {
    jest.spyOn(console, 'error')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render button without warnings', () => {
    render(
      <Button
        onPress={jest.fn()}
        onPressEnd={jest.fn()}
        onPressStart={jest.fn()}
        onPressUp={jest.fn()}
        preventFocusOnPress
      />,
    )
    expect(console.error).not.toBeCalled()
  })
})

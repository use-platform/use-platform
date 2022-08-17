import { FC } from 'react'

import { createClientRender, fireEvent, screen } from '../../internal/testing'
import { UseFocusProps, useFocus } from './useFocus'

const Fixture: FC<UseFocusProps<HTMLDivElement>> = (props) => {
  const { focusProps } = useFocus(props)

  return (
    <div {...focusProps} tabIndex={-1} data-testid="container">
      {props.children}
    </div>
  )
}

describe('useFocus', () => {
  const render = createClientRender()

  test('should call onFocus when the element is focused', () => {
    const onFocus = jest.fn()

    render(<Fixture onFocus={onFocus} />)

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocus).toBeCalledTimes(1)
  })

  test('should call onBlur when the element has lost focus', () => {
    const onBlur = jest.fn()

    render(<Fixture onBlur={onBlur} />)

    fireEvent.blur(screen.getByTestId('container'))

    expect(onBlur).toBeCalledTimes(1)
  })

  test('should call onFocusChange when the element is focused or has lost focus', () => {
    const onFocusChange = jest.fn()

    render(<Fixture onFocusChange={onFocusChange} />)

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocusChange).toBeCalledTimes(1)
    expect(onFocusChange).toBeCalledWith(true)

    fireEvent.blur(screen.getByTestId('container'))

    expect(onFocusChange).toBeCalledTimes(2)
    expect(onFocusChange).toBeCalledWith(false)
  })

  test('should not handle focus events from children', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onFocusChange = jest.fn()

    render(
      <Fixture onFocus={onFocus} onBlur={onBlur} onFocusChange={onFocusChange}>
        <button data-testid="child">child</button>
      </Fixture>,
    )

    fireEvent.focus(screen.getByTestId('child'))

    expect(onFocus).not.toHaveBeenCalled()
    expect(onBlur).not.toHaveBeenCalled()
    expect(onFocusChange).not.toHaveBeenCalled()

    fireEvent.blur(screen.getByTestId('child'))

    expect(onFocus).not.toHaveBeenCalled()
    expect(onBlur).not.toHaveBeenCalled()
    expect(onFocusChange).not.toHaveBeenCalled()
  })

  test('should not call handlers if disabled', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onFocusChange = jest.fn()

    render(<Fixture onFocus={onFocus} onBlur={onBlur} onFocusChange={onFocusChange} disabled />)

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocus).not.toHaveBeenCalled()
    expect(onBlur).not.toHaveBeenCalled()
    expect(onFocusChange).not.toHaveBeenCalled()

    fireEvent.blur(screen.getByTestId('container'))

    expect(onFocus).not.toHaveBeenCalled()
    expect(onBlur).not.toHaveBeenCalled()
    expect(onFocusChange).not.toHaveBeenCalled()
  })
})

import { FC } from 'react'

import { createClientRender, fireEvent, screen } from '../../internal/testing'
import { UseFocusWithinProps, useFocusWithin } from './useFocusWithin'

const Fixture: FC<UseFocusWithinProps<HTMLDivElement>> = (props) => {
  const { focusWithinProps } = useFocusWithin(props)

  return (
    <div {...focusWithinProps} tabIndex={-1} data-testid="container">
      {props.children}
    </div>
  )
}

describe('useFocusWithin', () => {
  const render = createClientRender()

  test('should call onFocusWithin when the element is focused', () => {
    const onFocusWithin = jest.fn()

    render(<Fixture onFocusWithin={onFocusWithin} />)

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocusWithin).toBeCalledTimes(1)

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocusWithin).toBeCalledTimes(1)
  })

  test('should call onFocusWithin when the child element is focused', () => {
    const onFocusWithin = jest.fn()

    render(
      <Fixture onFocusWithin={onFocusWithin}>
        <input type="text" data-testid="child" />
      </Fixture>,
    )

    fireEvent.focus(screen.getByTestId('child'))

    expect(onFocusWithin).toBeCalledTimes(1)

    fireEvent.focus(screen.getByTestId('child'))

    expect(onFocusWithin).toBeCalledTimes(1)
  })

  test('should call onBlurWithin when the element has lost focus', () => {
    const onBlurWithin = jest.fn()

    render(<Fixture onBlurWithin={onBlurWithin} />)

    fireEvent.focus(screen.getByTestId('container'))
    fireEvent.blur(screen.getByTestId('container'))

    expect(onBlurWithin).toBeCalledTimes(1)

    fireEvent.blur(screen.getByTestId('container'))

    expect(onBlurWithin).toBeCalledTimes(1)
  })

  test('should call onBlurWithin when the child element has lost focus', () => {
    const onBlurWithin = jest.fn()

    render(
      <Fixture onBlurWithin={onBlurWithin}>
        <input type="text" data-testid="child" />
      </Fixture>,
    )

    fireEvent.focus(screen.getByTestId('child'))
    fireEvent.blur(screen.getByTestId('child'))

    expect(onBlurWithin).toBeCalledTimes(1)

    fireEvent.blur(screen.getByTestId('child'))

    expect(onBlurWithin).toBeCalledTimes(1)
  })

  test('should call onFocusWithinChange on target focus events', () => {
    const onFocusWithinChange = jest.fn()

    render(<Fixture onFocusWithinChange={onFocusWithinChange} />)

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocusWithinChange).toBeCalledTimes(1)
    expect(onFocusWithinChange).toBeCalledWith(true)

    fireEvent.blur(screen.getByTestId('container'))

    expect(onFocusWithinChange).toBeCalledTimes(2)
    expect(onFocusWithinChange).toBeCalledWith(false)
  })

  test('should call onFocusWithinChange on child focus events', () => {
    const onFocusWithinChange = jest.fn()

    render(
      <Fixture onFocusWithinChange={onFocusWithinChange}>
        <input type="text" data-testid="child" />
      </Fixture>,
    )

    fireEvent.focus(screen.getByTestId('child'))

    expect(onFocusWithinChange).toBeCalledTimes(1)
    expect(onFocusWithinChange).toBeCalledWith(true)

    fireEvent.blur(screen.getByTestId('child'))

    expect(onFocusWithinChange).toBeCalledTimes(2)
    expect(onFocusWithinChange).toBeCalledWith(false)
  })

  test('should not call handlers if disabled', () => {
    const onFocusWithin = jest.fn()
    const onBlurWithin = jest.fn()
    const onFocusWithinChange = jest.fn()

    render(
      <Fixture
        onFocusWithin={onFocusWithin}
        onBlurWithin={onBlurWithin}
        onFocusWithinChange={onFocusWithinChange}
        disabled
      />,
    )

    fireEvent.focus(screen.getByTestId('container'))

    expect(onFocusWithin).not.toHaveBeenCalled()
    expect(onBlurWithin).not.toHaveBeenCalled()
    expect(onFocusWithinChange).not.toHaveBeenCalled()

    fireEvent.blur(screen.getByTestId('container'))

    expect(onFocusWithin).not.toHaveBeenCalled()
    expect(onBlurWithin).not.toHaveBeenCalled()
    expect(onFocusWithinChange).not.toHaveBeenCalled()
  })
})

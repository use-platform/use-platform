import { FC } from 'react'

import { UseSpinButtonProps, useSpinButton } from '.'
import { usePress } from '../../interactions/press'
import { createClientRender, fireEvent, installPointerEvent, screen } from '../../internal/testing'

const SpinButton: FC<UseSpinButtonProps> = (props) => {
  const { spinButtonProps, incrementButtonProps, decrementButtonProps } = useSpinButton(props)
  const { pressProps: incrementPressProps } = usePress<HTMLButtonElement>(incrementButtonProps)
  const { pressProps: decrementPressProps } = usePress<HTMLButtonElement>(decrementButtonProps)

  return (
    <div>
      <span {...spinButtonProps} />
      <button {...incrementPressProps} data-testid="increment">
        increment
      </button>
      <button {...decrementPressProps} data-testid="decrement">
        decrement
      </button>
    </div>
  )
}

describe('useSpinButton', () => {
  installPointerEvent()
  const render = createClientRender()

  test('should have correct aria attributes', () => {
    render(<SpinButton value={10} min={-50} max={50} textValue="10 item" />)

    const el = screen.getByRole('spinbutton')

    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('aria-valuenow', '10')
    expect(el).toHaveAttribute('aria-valuemin', '-50')
    expect(el).toHaveAttribute('aria-valuemax', '50')
    expect(el).toHaveAttribute('aria-valuetext', '10 item')
    expect(el).not.toHaveAttribute('aria-disabled')
    expect(el).not.toHaveAttribute('aria-readonly')
    expect(el).not.toHaveAttribute('aria-required')
  })

  test('should set aria-valuetext if textValue is not set', () => {
    render(<SpinButton value={3} />)

    const el = screen.getByRole('spinbutton')
    expect(el).toHaveAttribute('aria-valuetext', '3')
  })

  test('should not set aria attributes for undefined values', () => {
    render(<SpinButton />)

    const el = screen.getByRole('spinbutton')
    expect(el).toHaveAttribute('aria-valuetext', 'Empty')
    expect(el).not.toHaveAttribute('aria-valuenow')
    expect(el).not.toHaveAttribute('aria-valuemin')
    expect(el).not.toHaveAttribute('aria-valuemax')
  })

  test('should not set aria attributes for infinite values', () => {
    render(<SpinButton value={NaN} min={-Infinity} max={Infinity} />)

    const el = screen.getByRole('spinbutton')
    expect(el).not.toHaveAttribute('aria-valuenow')
    expect(el).not.toHaveAttribute('aria-valuemin')
    expect(el).not.toHaveAttribute('aria-valuemax')
  })

  test('should have aria-disabled if disabled is set', () => {
    render(<SpinButton disabled />)

    const el = screen.getByRole('spinbutton')
    expect(el).toHaveAttribute('aria-disabled', 'true')
  })

  test('should have aria-readonly if readOnly is set', () => {
    render(<SpinButton readOnly />)

    const el = screen.getByRole('spinbutton')
    expect(el).toHaveAttribute('aria-readonly', 'true')
  })

  test('should trigger onIncrement and onDecrement on press button', async () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    render(<SpinButton onIncrement={onIncrement} onDecrement={onDecrement} />)

    const increment = screen.getByTestId('increment')
    const decrement = screen.getByTestId('decrement')

    await fireEvent.click(increment)
    await fireEvent.click(decrement)

    expect(onIncrement).toBeCalledTimes(1)
    expect(onDecrement).toBeCalledTimes(1)
  })

  test('should repeat onIncrement and onDecrement on press down button', () => {
    jest.useFakeTimers()
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    render(<SpinButton onIncrement={onIncrement} onDecrement={onDecrement} />)

    const increment = screen.getByTestId('increment')
    const decrement = screen.getByTestId('decrement')

    fireEvent.pointerDown(increment)
    fireEvent.pointerDown(decrement)

    expect(onIncrement).toBeCalledTimes(1)
    expect(onDecrement).toBeCalledTimes(1)

    jest.runOnlyPendingTimers()
    jest.runOnlyPendingTimers()

    expect(onIncrement).toBeCalledTimes(3)
    expect(onDecrement).toBeCalledTimes(3)

    fireEvent.pointerUp(increment)
    fireEvent.pointerUp(decrement)

    expect(onIncrement).toBeCalledTimes(3)
    expect(onDecrement).toBeCalledTimes(3)

    jest.useRealTimers()
  })

  it('should not trigger onIncrement and onDecrement on press if disabled is set', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    render(<SpinButton onIncrement={onIncrement} onDecrement={onDecrement} disabled />)

    const increment = screen.getByTestId('increment')
    const decrement = screen.getByTestId('decrement')

    fireEvent.click(increment)
    fireEvent.click(decrement)

    expect(onIncrement).toBeCalledTimes(0)
    expect(onDecrement).toBeCalledTimes(0)
  })

  it('should trigger onIncrement on arrow up key', () => {
    const handler = jest.fn()
    render(<SpinButton onIncrement={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'ArrowUp' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onDecrement on arrow down key', () => {
    const handler = jest.fn()
    render(<SpinButton onDecrement={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'ArrowDown' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onExtraIncrement on page up key', () => {
    const handler = jest.fn()
    render(<SpinButton onExtraIncrement={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'PageUp' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onExtraDecrement on page down key', () => {
    const handler = jest.fn()
    render(<SpinButton onExtraDecrement={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'PageDown' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onIncrement on page up key if onExtraIncrement is not set', () => {
    const handler = jest.fn()
    render(<SpinButton onIncrement={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'PageUp' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onDecrement on page down key if onExtraDecrement is not set', () => {
    const handler = jest.fn()
    render(<SpinButton onDecrement={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'PageDown' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onIncrementToMax on end key', () => {
    const handler = jest.fn()
    render(<SpinButton onIncrementToMax={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'End' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should trigger onDecrementToMin on home key', () => {
    const handler = jest.fn()
    render(<SpinButton onDecrementToMin={handler} />)

    const el = screen.getByRole('spinbutton')
    fireEvent.keyDown(el, { key: 'Home' })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should not trigger onIncrement and onDecrement on keydown if disabled is set', () => {
    const onIncrement = jest.fn()
    const onDecrement = jest.fn()

    render(<SpinButton onIncrement={onIncrement} onDecrement={onDecrement} disabled />)

    const el = screen.getByRole('spinbutton')

    fireEvent.keyDown(el, { key: 'ArrowUp' })
    fireEvent.keyDown(el, { key: 'ArrowDown' })

    expect(onIncrement).toBeCalledTimes(0)
    expect(onDecrement).toBeCalledTimes(0)
  })

  it('should not trigger on keydown with special key', () => {
    const handler = jest.fn()

    render(<SpinButton onIncrement={handler} />)

    const el = screen.getByRole('spinbutton')

    fireEvent.keyDown(el, { key: 'ArrowUp', ctrlKey: true })
    fireEvent.keyDown(el, { key: 'ArrowUp', metaKey: true })
    fireEvent.keyDown(el, { key: 'ArrowUp', shiftKey: true })
    fireEvent.keyDown(el, { key: 'ArrowUp', altKey: true })

    expect(handler).toBeCalledTimes(0)
  })
})

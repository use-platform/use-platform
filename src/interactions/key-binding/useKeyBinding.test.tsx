import { fireEvent, renderHook } from '../../internal/testing'
import { UseKeyBindingProps } from './types'
import { useKeyBinding } from './useKeyBinding'

describe('useKeyboardEvent', () => {
  test('should call handler if key was pressed', () => {
    const keyUpHandler = jest.fn()
    renderHook(() => useKeyBinding({ bind: 'Space', onAction: keyUpHandler }))
    fireEvent.keyUp(document.body, { code: 'Space' })
    expect(keyUpHandler).toHaveBeenCalledWith(expect.objectContaining({ target: document.body }))
  })

  test('should not call handler if wrong key was pressed', () => {
    const keyUpHandler = jest.fn()
    renderHook(() => useKeyBinding({ bind: 'Space', onAction: keyUpHandler }))
    fireEvent.keyUp(document.body, { code: 'Enter' })
    expect(keyUpHandler).toHaveBeenCalledTimes(0)
  })

  test('should not call handler if `disabled` is true and call if it was set to false again', () => {
    const keyUpHandler = jest.fn()

    const defaultProps = { bind: 'Space', onAction: keyUpHandler }
    const { rerender } = renderHook<UseKeyBindingProps, unknown>(
      (options) => useKeyBinding({ ...options, ...defaultProps }),
      { initialProps: defaultProps },
    )
    fireEvent.keyUp(document.body, { code: 'Space' })
    expect(keyUpHandler).toHaveBeenCalledTimes(1)

    rerender({ ...defaultProps, disabled: true })
    fireEvent.keyUp(document.body, { code: 'Space' })
    expect(keyUpHandler).toHaveBeenCalledTimes(1)

    rerender(defaultProps)
    fireEvent.keyUp(document.body, { code: 'Space' })
    expect(keyUpHandler).toHaveBeenCalledTimes(2)
  })

  test('should deregister old handler and register new if handler was changed', () => {
    const keyUpHandler = jest.fn()
    const anotherKeyUpHandler = jest.fn()
    const defaultProps = { bind: 'Space', onAction: keyUpHandler }

    const { rerender } = renderHook<UseKeyBindingProps, unknown>(
      (options) => useKeyBinding({ ...defaultProps, ...options }),
      { initialProps: defaultProps },
    )
    fireEvent.keyUp(document.body, { code: 'Space' })
    expect(keyUpHandler).toHaveBeenCalledTimes(1)
    expect(anotherKeyUpHandler).toHaveBeenCalledTimes(0)

    rerender({ ...defaultProps, onAction: anotherKeyUpHandler })
    fireEvent.keyUp(document.body, { code: 'Space' })
    expect(keyUpHandler).toHaveBeenCalledTimes(1)
    expect(anotherKeyUpHandler).toHaveBeenCalledTimes(1)
  })
})

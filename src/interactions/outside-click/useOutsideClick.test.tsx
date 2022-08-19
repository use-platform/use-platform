import { fireEvent, renderHook } from '../../internal/testing'
import { UseOutsideClickProps } from './types'
import { useOutsideClick } from './useOutsideClick'

describe('useClickOutside', () => {
  test('should fire event on click outside on `refs` with pressdown startegy', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() => useOutsideClick({ refs, onAction, triggerStrategy: 'pressdown' }))

    fireEvent.pointerDown(document)

    expect(onAction).toBeCalledTimes(1)
    expect(onAction.mock.calls[0][0].type).toBe('pointerdown')
  })

  test('should fire event on click outside on `refs` with pressup startegy', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() => useOutsideClick({ refs, onAction, triggerStrategy: 'pressup' }))
    fireEvent.pointerDown(document)
    expect(onAction).not.toHaveBeenCalled()
    document.dispatchEvent(new Event('click'))

    expect(onAction).toBeCalledTimes(1)
    expect(onAction.mock.calls[0][0].type).toBe('click')
  })

  test('should not call `onAction` after clicking on `refs`', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() => useOutsideClick({ refs, onAction, triggerStrategy: 'pressdown' }))

    fireEvent.pointerDown(current)

    expect(onAction).not.toBeCalled()
  })

  test('should call updated handler and not to call old', () => {
    const firstHandler = jest.fn()
    const secondHandler = jest.fn()

    const defaultProps: UseOutsideClickProps = {
      refs: [],
      onAction: firstHandler,
      triggerStrategy: 'pressdown',
    }
    const { rerender } = renderHook<Partial<UseOutsideClickProps>, unknown>(
      (props) => useOutsideClick({ ...defaultProps, ...props }),
      {
        initialProps: {},
      },
    )
    fireEvent.pointerDown(document)
    expect(firstHandler).toBeCalledTimes(1)
    expect(secondHandler).not.toHaveBeenCalled()

    rerender({ onAction: secondHandler })
    fireEvent.pointerDown(document)
    expect(firstHandler).toBeCalledTimes(1)
    expect(secondHandler).toBeCalledTimes(1)
  })

  test('should use updated refs if prop was changed', () => {
    const current1 = document.createElement('div')
    const current2 = document.createElement('div')
    current1.setAttribute('data-testid', 'cuurent1')
    current2.setAttribute('data-testid', 'cuurent2')
    const onAction = jest.fn()
    const defaultProps: UseOutsideClickProps = {
      refs: [{ current: current1 }],
      onAction,
      triggerStrategy: 'pressdown',
    }
    document.body.appendChild(current1)
    document.body.appendChild(current2)

    const { rerender } = renderHook<Partial<UseOutsideClickProps>, unknown>(
      (props) => useOutsideClick({ ...defaultProps, ...props }),
      {
        initialProps: {},
      },
    )
    fireEvent.pointerDown(current1)
    expect(onAction).not.toHaveBeenCalled()
    fireEvent.pointerDown(current2)
    expect(onAction).toHaveBeenCalledTimes(1)

    rerender({ refs: [{ current: current2 }] })
    fireEvent.pointerDown(current1)
    expect(onAction).toHaveBeenCalledTimes(2)
    fireEvent.pointerDown(current2)
    expect(onAction).toHaveBeenCalledTimes(2)
  })

  test('should not call `onAction` after `pointerdown` on `refs` and `click` outside of `refs`', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() => useOutsideClick({ refs, onAction, triggerStrategy: 'pressup' }))

    fireEvent.pointerDown(current)
    document.dispatchEvent(new Event('click'))

    expect(onAction).not.toBeCalled()
  })

  test('should not call `onAction` after `pointerdown` on `refs` and `click` outside of `refs` if `refs` element has handler that stops propaganation', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)
    current.addEventListener('pointerdown', (event) => event.stopPropagation())

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() => useOutsideClick({ refs, onAction, triggerStrategy: 'pressup' }))

    fireEvent.pointerDown(current)
    document.dispatchEvent(new Event('click'))

    expect(onAction).not.toBeCalled()
  })

  test('should not call handler if user clicked other mouse button than left', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() => useOutsideClick({ refs, onAction, triggerStrategy: 'pressup' }))
    fireEvent.pointerDown(document)
    document.dispatchEvent(new MouseEvent('click', { button: 1 }))

    expect(onAction).not.toBeCalled()
  })

  test('should not call handler if event is disabled', () => {
    const current = document.createElement('div')
    document.body.appendChild(current)

    const refs = [{ current }]
    const onAction = jest.fn()
    renderHook(() =>
      useOutsideClick({ refs, onAction, triggerStrategy: 'pressup', disabled: true }),
    )
    fireEvent.pointerDown(document)
    document.dispatchEvent(new MouseEvent('click'))

    expect(onAction).not.toBeCalled()
  })
})

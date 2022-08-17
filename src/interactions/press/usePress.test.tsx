import { PropsWithChildren, forwardRef } from 'react'

import { PressProps, usePress } from '.'
import { createClientRender, fireEvent, installPointerEvent, screen } from '../../internal/testing'

const Pressable = forwardRef<HTMLButtonElement, PropsWithChildren<PressProps<HTMLButtonElement>>>(
  (props, ref) => {
    const { pressProps } = usePress(props)

    return (
      <button ref={ref} {...pressProps} data-testid="pressable">
        {props.children}
      </button>
    )
  },
)

describe('usePress', () => {
  const render = createClientRender()

  beforeEach(() => {
    global.document.elementFromPoint = jest.fn()
  })

  afterEach(() => {
    // @ts-expect-error
    global.document.elementFromPoint = undefined
  })

  describe.each`
    event             | isPointerEvent
    ${'PointerEvent'} | ${true}
    ${'TouchEvent'}   | ${false}
  `('$event', ({ isPointerEvent }) => {
    if (isPointerEvent) {
      installPointerEvent()
    }

    test('should set correct currentTarget for pointer events', () => {
      const onPressStart = jest.fn()
      const onPressEnd = jest.fn()
      const onPressUp = jest.fn()
      render(
        <Pressable onPressStart={onPressStart} onPressEnd={onPressEnd} onPressUp={onPressUp}>
          button
        </Pressable>,
      )
      const element = screen.getByTestId('pressable')
      const expected = expect.objectContaining({ currentTarget: element })

      jest
        .spyOn(global.document, 'elementFromPoint')
        .mockImplementationOnce(() => document.body)
        .mockImplementationOnce(() => element)
        .mockImplementationOnce(() => element)
        .mockImplementationOnce(() => element)

      fireEvent.pointerDown(element)
      fireEvent.touchStart(element, { targetTouches: [{ identifier: 1 }] })

      expect(onPressStart).toBeCalledTimes(1)
      expect(onPressStart).toBeCalledWith(expected)

      fireEvent.pointerMove(document)
      fireEvent.touchMove(document, { changedTouches: [{ identifier: 1 }] })

      expect(onPressEnd).toBeCalledTimes(1)
      expect(onPressEnd).toBeCalledWith(expected)

      fireEvent.pointerMove(document)
      fireEvent.touchMove(document, { changedTouches: [{ identifier: 1 }] })

      expect(onPressStart).toBeCalledTimes(2)
      expect(onPressStart).toBeCalledWith(expected)

      fireEvent.pointerUp(document)
      fireEvent.touchEnd(document, { changedTouches: [{ identifier: 1 }] })

      expect(onPressEnd).toBeCalledTimes(2)
      expect(onPressEnd).toBeCalledWith(expected)
      expect(onPressUp).toBeCalledTimes(1)
      expect(onPressUp).toBeCalledWith(expected)

      fireEvent.pointerDown(element)
      fireEvent.touchStart(element, { targetTouches: [{ identifier: 2 }] })

      expect(onPressStart).toBeCalledTimes(3)
      expect(onPressStart).toBeCalledWith(expected)

      fireEvent.pointerCancel(document)
      fireEvent.touchCancel(document)

      expect(onPressEnd).toBeCalledTimes(3)
      expect(onPressEnd).toBeCalledWith(expected)

      fireEvent.keyDown(element, { key: ' ' })

      expect(onPressStart).toBeCalledTimes(4)
      expect(onPressStart).toBeCalledWith(expected)

      fireEvent.keyUp(element, { key: ' ' })

      expect(onPressEnd).toBeCalledTimes(4)
      expect(onPressEnd).toBeCalledWith(expected)
      expect(onPressUp).toBeCalledTimes(2)
      expect(onPressUp).toBeCalledWith(expected)
    })
  })
})

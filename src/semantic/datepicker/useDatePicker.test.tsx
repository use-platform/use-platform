import { FC } from 'react'

import { createClientRender, screen, fireEvent, installPointerEvent } from '../../libs/testing'
import { useButton } from '../button'
import { UseDatePickerProps, useDatePicker } from './useDatePicker'

const Fixture: FC<UseDatePickerProps & { isOpen?: boolean; setOpen?: (isOpen: boolean) => void }> =
  (props) => {
    const { setOpen = () => null, isOpen = false } = props
    const { groupProps, triggerProps } = useDatePicker(props, {
      isOpen,
      setOpen,
      value: null,
      setValue: () => null,
    })
    const { buttonProps } = useButton(triggerProps, { current: null })

    return (
      <div {...groupProps} data-testid="group">
        <button {...buttonProps} data-testid="trigger" />
      </div>
    )
  }

describe('useDatePicker', () => {
  installPointerEvent()
  const render = createClientRender()

  test('should have correct role for root', () => {
    render(<Fixture />)

    expect(screen.getByTestId('group')).toHaveAttribute('role', 'group')
  })

  test('should have negative tabIndex for trigger', () => {
    render(<Fixture />)

    expect(screen.getByTestId('trigger')).toHaveAttribute('tabindex', '-1')
  })

  test('should call setOpen after keydown on space', () => {
    const setOpen = jest.fn()
    render(<Fixture setOpen={setOpen} />)

    fireEvent.keyDown(screen.getByTestId('group'), { key: ' ' })
    expect(setOpen).toHaveBeenCalledWith(true)
  })

  test('should not call setOpen after keydown on space if disabled or readonly', () => {
    const setOpen = jest.fn()
    const { setProps } = render(<Fixture setOpen={setOpen} />)

    const group = screen.getByTestId('group')

    setProps({ disabled: true, readOnly: false })
    fireEvent.keyDown(group, { key: ' ' })
    expect(setOpen).not.toBeCalled()

    setProps({ disabled: false, readOnly: true })
    fireEvent.keyDown(group, { key: ' ' })
    expect(setOpen).not.toBeCalled()
  })

  test('should call setOpen after press on trigger', () => {
    const setOpen = jest.fn()
    const { setProps } = render(<Fixture setOpen={setOpen} />)

    const trigger = screen.getByTestId('trigger')

    fireEvent.pointerDown(trigger)
    fireEvent.pointerUp(trigger)
    expect(setOpen).toBeCalledWith(true)

    setProps({ isOpen: true })

    fireEvent.pointerDown(trigger)
    fireEvent.pointerUp(trigger)
    expect(setOpen).toBeCalledWith(false)
  })
})

import { ChangeEvent, FC, useRef } from 'react'

import { usePress } from '../../interactions/press'
import { createClientRender, fireEvent, screen } from '../../internal/testing'
import { isFirefox } from '../../libs/platform'
import { RadioGroupContext } from './RadioGroupContext'
import { useRadio } from './useRadio'

jest.mock('../../libs/platform')
jest.mock('../../interactions/press')

const touchStartMock = jest.fn()

const Radio: FC<any> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps, isPressed, rootProps } = useRadio(props, inputRef)

  return (
    <label data-testid="label" {...rootProps}>
      <input
        {...inputProps}
        data-testid="radio"
        className={isPressed ? 'is-pressed' : ''}
        readOnly
      />
    </label>
  )
}

const usePressMocked = usePress as jest.MockedFunction<typeof usePress>
describe('useRadio', () => {
  beforeAll(() => {
    usePressMocked.mockReturnValue({
      isPressed: true,
      pressProps: { onTouchStart: touchStartMock },
    })
  })
  const render = createClientRender()

  test('should set correct type', () => {
    render(<Radio />)
    expect(screen.getByTestId('radio')).toHaveAttribute('type', 'radio')
  })

  test('should set value', () => {
    render(<Radio value="foo" />)
    expect(screen.getByTestId('radio')).toHaveAttribute('value', 'foo')
  })

  test('should set checked state', () => {
    render(<Radio defaultChecked value="foo" />)
    expect(screen.getByTestId('radio')).toHaveAttribute('checked')
  })

  test('should set aria-checked attribute', () => {
    render(<Radio defaultChecked value="foo" />)
    expect(screen.getByTestId('radio')).toHaveAttribute('aria-checked')
  })

  test('should set aria-invalid attribute if control is invalid', () => {
    render(<Radio value="foo" state="invalid" />)
    expect(screen.getByTestId('radio')).toHaveAttribute('aria-invalid')
  })

  test('should set aria-readonly attribute if control is readonly', () => {
    render(<Radio value="foo" readOnly />)
    expect(screen.getByTestId('radio')).toHaveAttribute('aria-readonly')
  })

  test('should turn autocomplete off if we are using Firefox', () => {
    // eslint-disable-next-line no-extra-semi
    ;(isFirefox as jest.MockedFunction<typeof isFirefox>).mockReturnValueOnce(true)
    render(<Radio value="foo" />)
    expect(screen.getByTestId('radio')).toHaveAttribute('autocomplete', 'off')
  })

  test('should call onChange callback if value was changed', async () => {
    const handler = jest.fn(() => null)
    render(<Radio value="foo" onChange={handler} />)
    await fireEvent.click(screen.getByTestId('radio'))
    expect(handler).toBeCalled()
  })

  test('should send warning to the console, if we are using checked/defaultChecked attribute with radiogroupcontextprovider in development mode', () => {
    const OLD_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const consoleSpy = jest.spyOn(console, 'warn')
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: () => {} }}>
        <Radio value="foo" defaultChecked />
      </RadioGroupContext.Provider>,
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Using checked/defaultChecked prop with RadioGroupContext will have no effect',
    )
    process.env.NODE_ENV = OLD_ENV
  })

  test('should set checked state based on RadioGroupContext', () => {
    render(
      <RadioGroupContext.Provider
        value={{ name: 'foo', selectedValue: 'foo', setSelectedValue: () => {} }}
      >
        <Radio value="foo" />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('checked')
  })

  test('should call setValue function when user checks radiobutton', async () => {
    const setValue = jest.fn()
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: setValue }}>
        <Radio value="foo" />
      </RadioGroupContext.Provider>,
    )
    await fireEvent.click(screen.getByTestId('radio'))
    const eventArg = setValue.mock.calls[0][0]
    expect((eventArg as ChangeEvent<HTMLInputElement>)?.target?.value).toBe('foo')
  })

  test('should not call setValue function when user checks radiobutton and component is readonly', () => {
    const setValue = jest.fn()
    render(
      <RadioGroupContext.Provider
        value={{ name: 'foo', setSelectedValue: setValue, isReadOnly: true }}
      >
        <Radio value="foo" />
      </RadioGroupContext.Provider>,
    )
    fireEvent.click(screen.getByTestId('radio'))
    expect(setValue).not.toHaveBeenCalled()
  })

  test('should send warning to the console, if we are using onChange attribute with radiogroupcontextprovider in development mode', () => {
    const OLD_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const consoleSpy = jest.spyOn(console, 'warn')
    const handler = jest.fn()
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: () => {} }}>
        <Radio value="foo" onChange={handler} />
      </RadioGroupContext.Provider>,
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Using onChange prop with RadioGroupContext will have no effect',
    )
    process.env.NODE_ENV = OLD_ENV
  })

  test('should set control name based on RadioGroupContext', () => {
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: () => {} }}>
        <Radio value="foo" />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('name', 'foo')
  })

  test('should send warning to the console, if we are using name attribute with radiogroupcontextprovider in development mode', () => {
    const OLD_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const consoleSpy = jest.spyOn(console, 'warn')
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: () => {} }}>
        <Radio value="foo" name="foo" />
      </RadioGroupContext.Provider>,
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Using name prop with RadioGroupContext will have no effect',
    )
    process.env.NODE_ENV = OLD_ENV
  })

  test('should disable all options if component is disabled via context', () => {
    render(
      <RadioGroupContext.Provider
        value={{ name: 'foo', setSelectedValue: () => {}, isDisabled: true }}
      >
        <Radio value="foo" />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('disabled')
  })

  test('should disable all options if component is disabled via context and some options are explicitly enabled', () => {
    render(
      <RadioGroupContext.Provider
        value={{ name: 'foo', setSelectedValue: () => {}, isDisabled: true }}
      >
        <Radio value="foo" disabled={false} />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('disabled')
  })

  test('should disable option if its disablity state is set explicitly, and context is set', () => {
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: () => {} }}>
        <Radio value="foo" disabled />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('disabled')
  })

  test('should mark all options as readonly if context state is readonly', () => {
    render(
      <RadioGroupContext.Provider
        value={{ name: 'foo', setSelectedValue: () => {}, isReadOnly: true }}
      >
        <Radio value="foo" />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('aria-readonly', 'true')
  })

  test('should mark single option as readonly if context is set', () => {
    render(
      <RadioGroupContext.Provider value={{ name: 'foo', setSelectedValue: () => {} }}>
        <Radio value="foo" readOnly />
      </RadioGroupContext.Provider>,
    )
    expect(screen.getByTestId('radio')).toHaveAttribute('aria-readonly', 'true')
  })

  test('should call usePress with correct props', () => {
    render(<Radio value="foo" preventFocusOnPress />)
    const usePressProps = usePressMocked.mock.calls[usePressMocked.mock.calls.length - 1][0]
    expect(usePressProps.preventFocusOnPress).toBeTruthy()
  })

  test('should return pressed state from usePress hook', () => {
    render(<Radio value="foo" />)
    expect(screen.getByTestId('radio')).toHaveClass('is-pressed')
  })

  test('should return root props from pressed hook', () => {
    touchStartMock.mockClear()
    render(<Radio value="foo" />)
    fireEvent.touchStart(screen.getByTestId('label'))
    expect(touchStartMock).toHaveBeenCalled()
  })
})

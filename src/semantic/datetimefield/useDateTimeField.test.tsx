import { FC, HTMLAttributes, useCallback, useRef, useState } from 'react'

import {
  DateTimeEditableSegment,
  UseDateTimeFieldStateProps,
  UseDateTimeFieldStateResult,
  useDateTimeField,
  useDateTimeFieldSegment,
  useDateTimeFieldState,
} from '.'
import { createClientRender, fireEvent, installPointerEvent, screen } from '../../internal/testing'
import { FocusManagerScope } from '../../libs/focus'
import { DateInputChangeEvent } from '../../shared/types'

interface EditableSegmentProps extends HTMLAttributes<HTMLElement> {
  segment: DateTimeEditableSegment
  state: UseDateTimeFieldStateResult
}

const EditableSegment: FC<EditableSegmentProps> = (props) => {
  const { state, segment, ...otherProps } = props
  const { segmentProps } = useDateTimeFieldSegment(props, state)

  return (
    <span {...otherProps} {...segmentProps}>
      {segment.text}
    </span>
  )
}

const DateTimeField: FC<UseDateTimeFieldStateProps> = (props) => {
  const state = useDateTimeFieldState(props)
  const { fieldProps, segmentProps } = useDateTimeField({})

  return (
    <span {...fieldProps} data-testid="field">
      {state.segments.map((segment, i) => {
        if (segment.isEditable) {
          return (
            <EditableSegment
              key={i}
              {...segmentProps}
              segment={segment}
              state={state}
              data-testid={`segment-${segment.type}`}
            />
          )
        }

        return (
          <span key={i} data-testid="literal">
            {segment.text}
          </span>
        )
      })}
    </span>
  )
}

const Fixture: FC<UseDateTimeFieldStateProps> = (props) => {
  const { value, onChange, ...other } = props
  const [localValue, setLocalValue] = useState<Date | null>(() => (value ? new Date(value) : null))
  const ref = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (event: DateInputChangeEvent<Date | null>) => {
      setLocalValue(event.value)
      onChange?.(event)
    },
    [onChange],
  )

  return (
    <FocusManagerScope scopeRef={ref}>
      <div ref={ref}>
        <DateTimeField {...other} value={localValue} onChange={handleChange} />
      </div>
    </FocusManagerScope>
  )
}

describe('useDateTimeField', () => {
  installPointerEvent()
  const render = createClientRender()

  test('should support arrow keys to move between segments', () => {
    render(<Fixture />)

    const segments = screen.getAllByRole('spinbutton')

    segments[0].focus()

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      expect(segment).toHaveFocus()

      fireEvent.keyDown(segment, { key: 'ArrowRight' })
    }

    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i]
      expect(segment).toHaveFocus()

      fireEvent.keyDown(segment, { key: 'ArrowLeft' })
    }
  })

  test('should focus the next segment on click on a field or literal segment', () => {
    render(<Fixture formatOptions={{ day: '2-digit', month: '2-digit', year: '2-digit' }} />)

    const field = screen.getByTestId('field')
    const literals = screen.getAllByTestId('literal')
    const segments = screen.getAllByRole('spinbutton')

    fireEvent.pointerDown(field)
    fireEvent.pointerUp(field)

    for (let i = 0; i < segments.length; i++) {
      expect(segments[i]).toHaveFocus()

      if (literals[i]) {
        fireEvent.pointerDown(literals[i])
        fireEvent.pointerUp(literals[i])
      }
    }
  })

  test('should reset segment value on keydown backspace key', () => {
    render(
      <Fixture
        formatOptions={{ year: '2-digit' }}
        value={new Date(1990, 0)}
        placeholder={new Date(1905, 0)}
      />,
    )

    const segment = screen.getByTestId('segment-year')
    expect(segment).toHaveAttribute('aria-valuenow', '1990')

    fireEvent.keyDown(segment, { key: 'Backspace' })
    expect(segment).not.toHaveAttribute('aria-valuenow')
  })

  test('should set segment value from keyboard typed key', async () => {
    render(<Fixture formatOptions={{ year: '2-digit' }} value={new Date(1990, 0)} />)

    const segment = screen.getByTestId('segment-year')

    await fireEvent.type(segment, '1997')

    expect(segment).toHaveAttribute('aria-valuenow', '1997')
  })

  test('should focus next segment after typed key if next value greater or equal maximum', async () => {
    render(
      <Fixture
        formatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        value={new Date(1990, 0, 1, 0, 0, 0)}
      />,
    )

    const segments = screen.getAllByRole('spinbutton')

    await fireEvent.type(segments[0], '09')
    expect(segments[1]).toHaveFocus()
  })

  test('should support increment and decrement value from keyboard', () => {
    render(
      <Fixture
        formatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        value={new Date(1990, 0, 1, 0, 27, 0)}
      />,
    )

    const segment = screen.getByTestId('segment-minute')

    fireEvent.keyDown(segment, { key: 'ArrowUp' })
    expect(segment).toHaveAttribute('aria-valuenow', '28')

    fireEvent.keyDown(segment, { key: 'PageUp' })
    expect(segment).toHaveAttribute('aria-valuenow', '30')

    fireEvent.keyDown(segment, { key: 'PageDown' })
    expect(segment).toHaveAttribute('aria-valuenow', '25')

    fireEvent.keyDown(segment, { key: 'ArrowDown' })
    expect(segment).toHaveAttribute('aria-valuenow', '24')

    fireEvent.keyDown(segment, { key: 'Home' })
    expect(segment).toHaveAttribute('aria-valuenow', '0')

    fireEvent.keyDown(segment, { key: 'End' })
    expect(segment).toHaveAttribute('aria-valuenow', '59')
  })

  test('should bubble keydown with space key', () => {
    const onKeyDown = jest.fn()
    render(
      <div onKeyDown={onKeyDown}>
        <Fixture />
      </div>,
    )

    const segments = screen.getAllByRole('spinbutton')

    segments[0].focus()
    fireEvent.keyDown(segments[0], { key: ' ' })

    expect(onKeyDown).toBeCalledTimes(1)
  })

  test('should prevent keydown event with enter key', () => {
    const onKeyDown = jest.fn()
    render(
      <div onKeyDown={onKeyDown}>
        <Fixture />
      </div>,
    )

    const segment = screen.getByTestId('segment-year')

    fireEvent.keyDown(segment, { key: 'Enter' })

    expect(onKeyDown).toBeCalledWith(expect.objectContaining({ defaultPrevented: true }))
  })

  test.each`
    pointerType
    ${'mouse'}
    ${'touch'}
    ${'pen'}
  `(
    'should focus in first segment when pointer of $pointerType is down on field',
    ({ pointerType }) => {
      render(<Fixture />)

      const field = screen.getByTestId('field')
      const segments = screen.getAllByRole('spinbutton')

      fireEvent.pointerDown(field, { pointerType })
      fireEvent.pointerUp(field, { pointerType })

      expect(segments[0]).toHaveFocus()
    },
  )
})

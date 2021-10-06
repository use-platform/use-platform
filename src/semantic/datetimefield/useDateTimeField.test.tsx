import { FC, HTMLAttributes, useCallback, useRef, useState } from 'react'

import { createClientRender, screen, fireEvent, installPointerEvent } from '../../libs/testing'
import { FocusManagerScope } from '../../libs/focus'
import {
  DateTimeChangeEvent,
  DateTimeEditableSegment,
  useDateTimeField,
  useDateTimeFieldSegment,
  useDateTimeFieldState,
  UseDateTimeFieldStateResult,
  UseDateTimeFieldStateProps,
} from '.'

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
  const [localValue, setLocalValue] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (event: DateTimeChangeEvent) => {
      setLocalValue(event.value)
      onChange?.(event)
    },
    [onChange],
  )

  return (
    <FocusManagerScope value={ref}>
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

    fireEvent.click(field)

    for (let i = 0; i < segments.length; i++) {
      expect(segments[i]).toHaveFocus()

      if (literals[i]) {
        fireEvent.click(literals[i])
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

  test('should set segment value from keyboard typed key', () => {
    render(<Fixture formatOptions={{ year: '2-digit' }} value={new Date(1990, 0)} />)

    const segment = screen.getByTestId('segment-year')

    fireEvent.type(segment, '1997')

    expect(segment).toHaveAttribute('aria-valuenow', '1997')
  })

  test('should focus next segment after typed key if next value greater or equal maximum', () => {
    render(
      <Fixture
        formatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        value={new Date(1990, 0, 1, 0, 0, 0)}
      />,
    )

    const segments = screen.getAllByRole('spinbutton')

    fireEvent.type(segments[0], '09')
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
})

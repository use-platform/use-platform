import {
  DateInputChangeEvent,
  DateTimeEditableSegment,
  UseDateTimeFieldStateResult,
  useDateTimeField,
  useDateTimeFieldSegment,
  useDateTimeFieldState,
} from '@yandex/web-platform'
import { FocusManagerScope } from '@yandex/web-platform/libs/focus'
import { FC, HTMLAttributes, forwardRef, useCallback, useRef, useState } from 'react'

const styles = `
.DateTimeField {
  background: #fff;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  border-radius: 8px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  color: #000;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.DateTimeField:focus-within {
  border-color: #b3b3b3;
}

.DateTimeField-Segment {
  outline: none;
  padding: 1px;
  caret-color: transparent;
}

.DateTimeField-Segment:focus {
  background-color: rgb(153, 200, 255);
}

.DateTimeField-Segment[data-placeholder='true'] {
  color: rgba(0, 0, 0, 0.5);
}

.DateTimeField-Segment[data-valid='false'] {
  color: #ff3333;
}

.DateTimeField-Segment[data-disabled='true'] {
  color: rgba(0, 0, 0, 0.45);
}

.DateTimeField-Literal {
  white-space: pre;
  user-select: none;
}
`

export const Default = (props: any) => {
  const { onChange } = props
  const [value, setValue] = useState<Date | null>(null)
  const ref = useRef<HTMLElement>(null)

  const handleChange = useCallback(
    (event: DateInputChangeEvent<Date | null>) => {
      setValue(event.value)
      onChange?.(event)
    },
    [onChange],
  )

  return (
    <>
      <style>{styles}</style>
      <FocusManagerScope scopeRef={ref}>
        <DateTimeField ref={ref} {...props} value={value} onChange={handleChange} />
      </FocusManagerScope>
    </>
  )
}

Default.argTypes = {
  onChange: { action: 'change' },
  min: {
    control: {
      type: 'date',
    },
  },
  max: {
    control: {
      type: 'date',
    },
  },
  placeholder: {
    control: {
      type: 'date',
    },
  },
}

Default.args = {
  min: undefined,
  max: undefined,
  placeholder: undefined,
  disabled: false,
  readOnly: false,
  formatOptions: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
}

const DateTimeField = forwardRef<HTMLSpanElement, any>((props, ref) => {
  const state = useDateTimeFieldState(props)
  const { fieldProps, segmentProps } = useDateTimeField(props)

  return (
    <span {...fieldProps} ref={ref} className="DateTimeField">
      {state.segments.map((segment, i) => {
        if (segment.isEditable) {
          return <EditableSegment key={i} {...segmentProps} segment={segment} state={state} />
        }

        return (
          <span key={i} role="presentation" className="DateTimeField-Literal">
            {segment.text}
          </span>
        )
      })}
    </span>
  )
})

interface EditableSegmentProps extends HTMLAttributes<HTMLElement> {
  segment: DateTimeEditableSegment
  state: UseDateTimeFieldStateResult
}

const EditableSegment: FC<EditableSegmentProps> = (props) => {
  const { state, segment, ...otherProps } = props
  const { segmentProps } = useDateTimeFieldSegment(props, state)

  return (
    <span
      {...segmentProps}
      {...otherProps}
      className="DateTimeField-Segment"
      data-valid={segment.isValid}
      data-disabled={segment.isDisabled}
      data-placeholder={segment.isPlaceholder}
    >
      {segment.text}
    </span>
  )
}

import { FC, forwardRef, HTMLAttributes, useRef } from 'react'
import { FocusManagerScope } from '@yandex/web-platform/libs/focus'
import {
  useDateTimeField,
  useDateTimeFieldSegment,
  useDateTimeFieldState,
  UseDateTimeFieldStateResult,
  DateTimeEditableSegment,
} from '@yandex/web-platform'

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
  const ref = useRef<HTMLElement>(null)

  return (
    <>
      <style>{styles}</style>
      <FocusManagerScope value={ref}>
        <DateTimeField ref={ref} {...props} />
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
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h12',
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

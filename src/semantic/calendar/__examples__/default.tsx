import { CSSProperties, FC, KeyboardEvent, useRef, useState } from 'react'
import {
  useCalendarCell,
  UseCalendarCellProps,
  CalendarState,
} from '@yandex/web-platform/semantic/calendar'

function getDays(viewDate: Date) {
  const month = viewDate.getMonth()
  const year = viewDate.getFullYear()

  const daysInMonth = new Date(year, (month + 1) % 12, 0).getDate()
  let monthStartsAt = (new Date(year, month, 1).getDay() - 1) % 7
  if (monthStartsAt < 0) {
    monthStartsAt += 7
  }
  const weeksInMonth = Math.ceil((monthStartsAt + daysInMonth) / 7)

  const data: Date[][] = []

  for (let weekIndex = 0; weekIndex < weeksInMonth; weekIndex++) {
    data.push([])

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = weekIndex * 7 + dayIndex - monthStartsAt + 1
      const value = new Date(year, month, day)

      data[weekIndex].push(value)
    }
  }

  return data
}

const Cell: FC<UseCalendarCellProps & { state: CalendarState }> = (props) => {
  const { state, viewDate, value, children } = props
  const ref = useRef<HTMLElement>(null)

  const { cellState, cellProps, buttonProps } = useCalendarCell({ viewDate, value }, state, ref)
  const { isFocused, isSelected, isToday, isSameView } = cellState

  const style: CSSProperties = {
    display: 'flex',
    borderRadius: '50%',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    outline: 0,
  }

  if (isToday) {
    style.textDecoration = 'underline'
  }

  if (isFocused) {
    style.boxShadow = '0 0 0 2px #fc0'
  }

  if (isSelected) {
    style.color = 'white'
    style.backgroundColor = 'red'
  }

  if (!isSameView) {
    style.opacity = 0.4
  }

  return (
    <td {...cellProps} style={{ padding: 8 }}>
      <span ref={ref} {...buttonProps} style={style}>
        {children}
      </span>
    </td>
  )
}

export const Default = () => {
  const [selected, selectDate] = useState<Date>()
  const [focusedDate, focusDate] = useState(() => new Date())

  const mockState: CalendarState = {
    value: selected,
    selectDate,

    focusedDate,
    focusDate,

    activeView: 'day',
    setActiveView: () => null,

    calendarFocused: true,
    focusCalendar: () => null,

    getCellState: (value, viewDate) => {
      const today = new Date()

      return {
        isDisabled: false,
        isFocused:
          value.getDate() === focusedDate.getDate() &&
          value.getMonth() === focusedDate.getMonth() &&
          value.getFullYear() === focusedDate.getFullYear(),
        isRangePrevieEnd: false,
        isRangePreview: false,
        isRangePreviewStart: false,
        isRangeSelected: false,
        isSameView:
          value.getMonth() === viewDate.getMonth() &&
          value.getFullYear() === viewDate.getFullYear(),
        isSelected: selected
          ? value.getDate() === selected.getDate() &&
            value.getMonth() === selected.getMonth() &&
            value.getFullYear() === selected.getFullYear()
          : false,
        isSelectionEnd: false,
        isSelectionStart: false,
        isToday:
          value.getDate() === today.getDate() &&
          value.getMonth() === today.getMonth() &&
          value.getFullYear() === today.getFullYear(),
      }
    },

    getData: (viewDate: Date) => getDays(viewDate),
    highlightDate: () => null,
    moveDate: (date) => date,
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const nextFocusedDate = new Date(focusedDate)
    let handled = false

    switch (event.key) {
      case 'ArrowLeft': {
        nextFocusedDate.setDate(nextFocusedDate.getDate() - 1)
        handled = true
        break
      }

      case 'ArrowRight': {
        nextFocusedDate.setDate(nextFocusedDate.getDate() + 1)
        handled = true
        break
      }

      case 'ArrowUp': {
        nextFocusedDate.setDate(nextFocusedDate.getDate() - 7)
        handled = true
        break
      }

      case 'ArrowDown': {
        nextFocusedDate.setDate(nextFocusedDate.getDate() + 7)
        handled = true
        break
      }
    }

    if (handled) {
      event.preventDefault()
      mockState.focusDate(nextFocusedDate)
    }
  }

  const data = mockState.getData(focusedDate)

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={7}>
            {focusedDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </th>
        </tr>
      </thead>

      {/* eslint-disable-next-line react/jsx-no-bind */}
      <tbody onKeyDown={onKeyDown}>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Cell key={cellIndex} value={cell} viewDate={focusedDate} state={mockState}>
                {cell.getDate()}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

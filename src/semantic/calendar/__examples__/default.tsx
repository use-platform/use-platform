import {
  BaseCalendarProps,
  CalendarNavigationAction,
  CalendarState,
  CalendarView,
  DateInputChangeEvent,
  RangeValue,
  UseCalendarCellProps,
  UseCalendarProps,
  UseMultipleCalendarStateProps,
  UseRangeCalendarStateProps,
  UseSingleCalendarStateProps,
  useCalendar,
  useCalendarCell,
  useDateFormatter,
  useMultipleCalendarState,
  useRangeCalendarState,
  useSingleCalendarState,
} from '@yandex/web-platform'
import { FC, useCallback, useMemo, useRef, useState } from 'react'

const styles = `
  .Table {
    display: inline-table;
    border-collapse: collapse;
    width: 252px;
  }

  .Cell {
    padding: 0;
  }

  .CellButton {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 0;
    flex: 1 0;
    min-width: 36px;
    min-height: 36px;
  }

  .CellButton[data-today='true'] {
    color: blue;
    text-decoration: underline;
  }

  .CellButton[data-focused='true'] {
    box-shadow: inset 0 0 0 2px #fc0;
  }

  .CellButton[class][data-selected='true'],
  .CellButton[class][data-range-selection-start='true'] {
    background-color: #f00;
    color: #fff;
  }

  .CellButton[data-range-selected='true'] {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .CellButton[data-range-preview='true'] {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .CellButton[data-range-selection-start='true'],
  .CellButton[data-range-preview-start='true'] {
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
  }

  .CellButton[data-range-selection-end='true'],
  .CellButton[data-range-preview-end='true'] {
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
  }

  .CellButton[data-outside-view='true'] {
    opacity: 0.6;
  }

  .CellButton[data-disabled='true'] {
    opacity: 0.3;
  }
`

interface CellProps extends UseCalendarCellProps {
  state: CalendarState
}

const Cell: FC<CellProps> = (props) => {
  const { state, children } = props
  const ref = useRef<HTMLElement>(null)

  const { cellState, cellProps, buttonProps } = useCalendarCell(props, state, ref)
  const {
    isFocused,
    isSelected,
    isToday,
    isSameView,
    isDisabled,
    isRangeSelected,
    isRangePreview,
    isSelectionStart,
    isSelectionEnd,
    isRangePreviewStart,
    isRangePreviewEnd,
  } = cellState

  return (
    <td className="Cell" {...cellProps}>
      <span
        ref={ref}
        className="CellButton"
        {...buttonProps}
        data-today={isToday}
        data-focused={state.isCalendarFocused && isFocused}
        data-selected={isSelected}
        data-range-selected={isRangeSelected}
        data-range-preview={isRangePreview}
        data-range-preview-start={isRangePreviewStart}
        data-range-preview-end={isRangePreviewEnd}
        data-range-selection-start={isSelectionStart}
        data-range-selection-end={isSelectionEnd}
        data-outside-view={!isSameView}
        data-disabled={isDisabled}
      >
        {children}
      </span>
    </td>
  )
}

interface HeaderProps {
  viewRange: RangeValue<Date>
  state: CalendarState
  prevHidden?: boolean
  nextHidden?: boolean
}

const Header: FC<HeaderProps> = (props) => {
  const { viewRange, prevHidden, nextHidden, state } = props
  const { activeView, baseDate, navigateTo, moveDate, canNavigateTo, setView, moveView } = state

  const dateFormatter = useDateFormatter(
    useMemo(() => {
      const options: Record<CalendarView, Intl.DateTimeFormatOptions> = {
        day: { month: 'long', year: 'numeric' },
        month: { year: 'numeric' },
        year: { year: 'numeric' },
      }

      return options[activeView]
    }, [activeView]),
  )

  const colSpan = { day: 7, month: 3, year: 5 }[activeView]
  const candidatePrev = moveDate(baseDate, CalendarNavigationAction.PrevView)
  const candidateNext = moveDate(baseDate, CalendarNavigationAction.NextView)

  const handleChangeView = useCallback(() => {
    setView(moveView(activeView, 1))
  }, [activeView, moveView, setView])

  const handleNavigateToPrevView = useCallback(() => {
    if (canNavigateTo(candidatePrev)) {
      navigateTo(candidatePrev)
    }
  }, [canNavigateTo, candidatePrev, navigateTo])

  const handleNavigateToNextView = useCallback(() => {
    if (canNavigateTo(candidateNext)) {
      navigateTo(candidateNext)
    }
  }, [canNavigateTo, candidateNext, navigateTo])

  return (
    <thead>
      <tr>
        <th colSpan={colSpan}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <button
              disabled={!canNavigateTo(candidatePrev)}
              onClick={handleNavigateToPrevView}
              style={{ visibility: prevHidden ? 'hidden' : undefined }}
            >
              &lt;
            </button>

            <span onClick={handleChangeView}>
              {activeView === 'year' ? (
                <>
                  {dateFormatter.format(viewRange.start)}-{dateFormatter.format(viewRange.end)}
                </>
              ) : (
                dateFormatter.format(viewRange.start)
              )}
            </span>

            <button
              disabled={!canNavigateTo(candidateNext)}
              onClick={handleNavigateToNextView}
              style={{ visibility: nextHidden ? 'hidden' : undefined }}
            >
              &gt;
            </button>
          </div>
        </th>
      </tr>
    </thead>
  )
}

interface CalendarBaseProps extends UseCalendarProps {
  state: CalendarState
}

const CalendarBase: FC<CalendarBaseProps> = (props) => {
  const { state } = props
  const { views } = state

  const { gridProps } = useCalendar(props, state)
  const dateFormatter = useDateFormatter(
    useMemo(() => {
      const options: Record<CalendarView, Intl.DateTimeFormatOptions> = {
        day: { day: 'numeric' },
        month: { month: 'short' },
        year: { year: 'numeric' },
      }

      return options[state.activeView]
    }, [state.activeView]),
  )

  return (
    <>
      <style>{styles}</style>
      <div>
        {views.map(({ data, viewDate, viewRange }, index) => (
          <table key={index} className="Table">
            <Header
              state={state}
              viewRange={viewRange}
              prevHidden={index > 0}
              nextHidden={index < views.length - 1}
            />

            <tbody {...gridProps}>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <Cell key={cellIndex} value={cell} viewDate={viewDate} state={state}>
                      {dateFormatter.format(cell)}
                    </Cell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </>
  )
}

type SingleCalendarProps = UseSingleCalendarStateProps

const SingleCalendar: FC<SingleCalendarProps> = (props) => {
  const state = useSingleCalendarState(props)

  return <CalendarBase state={state} />
}

type RangeCalendarProps = UseRangeCalendarStateProps

const RangeCalendar: FC<RangeCalendarProps> = (props) => {
  const state = useRangeCalendarState(props)

  return <CalendarBase state={state} />
}

type MultipleCalendarProps = UseMultipleCalendarStateProps

const MultipleCalendar: FC<MultipleCalendarProps> = (props) => {
  const state = useMultipleCalendarState(props)

  return <CalendarBase state={state} />
}

const argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  viewsCount: {
    control: {
      type: 'number',
      min: 1,
      max: 3,
    },
  },
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
  defaultFocusedDate: {
    control: {
      type: 'date',
    },
  },
  defaultCalendarView: {
    control: {
      type: 'radio',
      options: ['day', 'month', 'year'],
    },
  },
  minCalendarView: {
    control: {
      type: 'radio',
      options: ['day', 'month', 'year'],
    },
  },
  maxCalendarView: {
    control: {
      type: 'radio',
      options: ['day', 'month', 'year'],
    },
  },
}

const args = {
  viewsCount: 2,
}

function normalizeProps(props: any): BaseCalendarProps {
  return {
    ...props,
    disabled: String(props.disabled) === 'true',
    readOnly: String(props.readOnly) === 'true',
    defaultFocusedDate: props.defaultFocusedDate ? new Date(props.defaultFocusedDate) : undefined,
    min: props.min ? new Date(props.min) : undefined,
    max: props.max ? new Date(props.max) : undefined,
  }
}

export const Single = (props: any) => {
  const [value, setValue] = useState<Date>()
  const onChange = useCallback((event: DateInputChangeEvent<Date>) => {
    setValue(event.value)
  }, [])

  return <SingleCalendar {...normalizeProps(props)} value={value} onChange={onChange} />
}

Single.argTypes = argTypes
Single.args = args

export const Multiple = (props: any) => {
  const [value, setValue] = useState<Date[]>()
  const onChange = useCallback((event: DateInputChangeEvent<Date[]>) => {
    setValue(event.value)
  }, [])

  return <MultipleCalendar {...normalizeProps(props)} value={value} onChange={onChange} />
}

Multiple.argTypes = argTypes
Multiple.args = args

export const Range = (props: any) => {
  const [value, setValue] = useState<RangeValue<Date | null>>()
  const onChange = useCallback((event: DateInputChangeEvent<RangeValue<Date | null>>) => {
    setValue(event.value)
  }, [])

  return <RangeCalendar {...normalizeProps(props)} value={value} onChange={onChange} />
}

Range.argTypes = argTypes
Range.args = args

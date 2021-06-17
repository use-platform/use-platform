import { RangeValue, ValueProps } from '../../shared/types'

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type CalendarView = 'day' | 'month' | 'year'

export type CalendarViewsGrid = [rows: number, columns: number]

export interface CalendarBaseProps extends ValueProps<Date | Date[] | RangeValue<Date>> {
  /**
   * The date that will be displayed on mount.
   */
  defaultFocusedDate?: Date

  /**
   * The default calendar view.
   *
   * @default "day"
   */
  defaultCalendarView?: CalendarView

  /**
   * The minimum calendar view.
   *
   * @default "day"
   */
  minCalendarView?: CalendarView

  /**
   * The maximum calendar view.
   *
   * @default "year"
   */
  maxCalendarView?: CalendarView

  /**
   * The calendar views grid size.
   *
   * @default [1, 1]
   */
  viewsGrid?: CalendarViewsGrid

  /**
   * Whether the input can be selected but not changed by the user.
   */
  readOnly?: boolean

  /**
   * Disable select date.
   */
  disabled?: boolean

  /**
   * The auto focus cell on mount.
   */
  autoFocus?: boolean

  /**
   * The minimum date for select value.
   *
   * @default "0001-01-01T00:00Z"
   */
  min?: Date

  /**
   * The maximum date for select value.
   *
   * @default "275760-09-13T00:00Z"
   */
  max?: Date
}

export enum CalendarMoveAction {
  PrevCell,
  NextCell,
  UpperCell,
  LowerCell,
  FirstCell,
  LastCell,
  StartCell,
  EndCell,
  PrevView,
  NextView,
  PrevExtraView,
  NextExtraView,
}

export interface CalendarCellState {
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  isFocused: boolean
  isSameView: boolean
  isRangePreview: boolean
  isRangePreviewStart: boolean
  isRangePrevieEnd: boolean
  // TODO: May be isInRange
  isRangeSelected: boolean
  isSelectionStart: boolean
  isSelectionEnd: boolean
}

export interface CalendarState {
  /**
   * The current selected value.
   */
  value?: Date

  /**
   * The current active calendar view.
   */
  activeView: CalendarView

  /**
   * The current focused date.
   */
  focusedDate: Date

  /**
   * This flag indicates whether the calendar is in focus.
   */
  calendarFocused: boolean

  /**
   * Move focus to the date.
   */
  focusDate: (date: Date) => void

  /**
   * Set or remove focus from the calendar.
   */
  focusCalendar: (focused: boolean) => void

  /**
   * Set the date as the value.
   */
  selectDate: (date: Date) => void

  /**
   * Get the state for calendar cell.
   */
  getCellState: (value: Date, viewDate: Date) => CalendarCellState

  /**
   * Change the current calendar view.
   */
  setActiveView: (view: CalendarView) => void

  // TODO: wip
  getData: (viewDate: Date) => Date[][]
  highlightDate: (date: Date) => void
  moveDate: (date: Date, action: CalendarMoveAction) => Date
}

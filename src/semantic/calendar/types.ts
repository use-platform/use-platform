import { RangeValue, ValueProps } from '../../shared/types'

export type CalendarView = 'day' | 'month' | 'year'

export enum CalendarViewKind {
  day = 0,
  month = 1,
  year = 2,
}

export interface CalendarViewData {
  viewDate: Date
  viewRange: RangeValue<Date>
  data: Date[][]
}

export enum CalendarNavigationAction {
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

export interface RangeCalendarCellState {
  isRangePreview: boolean
  isRangePreviewStart: boolean
  isRangePreviewEnd: boolean
  isRangeSelected: boolean
  isSelectionStart: boolean
  isSelectionEnd: boolean
}

export interface CalendarCellState extends Partial<RangeCalendarCellState> {
  isToday: boolean
  isWeekend: boolean
  isSelected: boolean
  isDisabled: boolean
  isFocused: boolean
  isSameView: boolean
}

export interface BaseCalendarProps {
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
   * Number of calendars.
   *
   * @default 1
   */
  viewsCount?: number

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

export type SingleCalendarProps = ValueProps<Date> & BaseCalendarProps

export type MultipleCalendarProps = ValueProps<Date[]> & BaseCalendarProps

export type RangeCalendarProps = ValueProps<RangeValue<Date>> & BaseCalendarProps

export interface BaseCalendarState {
  /**
   * The current active calendar view.
   */
  activeView: CalendarView

  /**
   * Base date for navigation in calendar.
   */
  baseDate: Date

  /**
   * The current focused date.
   */
  focusedDate: Date

  /**
   * This flag indicates whether the calendar is in focus.
   */
  isCalendarFocused: boolean

  /**
   * Views data list.
   */
  views: CalendarViewData[]

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
  setView: (view: CalendarView) => void

  /**
   * Move date by action for navigation.
   */
  moveDate: (date: Date, action: CalendarNavigationAction) => Date

  /**
   * Check the move for a specific date.
   */
  canNavigateTo: (date: Date) => boolean

  /**
   * Navigate to specific date.
   */
  navigateTo: (date: Date) => void

  moveView: (view: CalendarView, offset: number) => CalendarView
}

export interface SingleCalendarState extends BaseCalendarState {
  /**
   * Selection mode.
   */
  mode: 'single'

  /**
   * The current selected value.
   */
  value?: Date
}

export interface MultipleCalendarState extends BaseCalendarState {
  /**
   * Selection mode.
   */
  mode: 'multiple'

  /**
   * The current selected values.
   */
  value?: Date[]
}

export interface RangeCalendarState extends BaseCalendarState {
  /**
   * Selection mode.
   */
  mode: 'range'

  /**
   * The current selected range value.
   */
  value?: RangeValue<Date>

  highlightDate: (date: Date) => void
}

export type CalendarState = SingleCalendarState | MultipleCalendarState | RangeCalendarState

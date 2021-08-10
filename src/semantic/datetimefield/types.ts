export type DateLike = number | Date

export type DateTimeSegmentTypes = Intl.DateTimeFormatPartTypes

export type DateTimeReadOnlySegmentTypes = 'era' | 'literal' | 'timeZoneName' | 'weekday'

export type DateTimeEditableSegmentTypes = Exclude<
  DateTimeSegmentTypes,
  DateTimeReadOnlySegmentTypes
>

export interface DateTimeReadOnlySegment {
  type: DateTimeReadOnlySegmentTypes
  text: string
  isEditable: false
}

export interface DateTimeSegmentLimits {
  value: number
  min: number
  max: number
}

export interface DateTimeEditableSegment extends DateTimeSegmentLimits {
  type: DateTimeEditableSegmentTypes
  text: string
  isEditable: true
  isPlaceholder: boolean
  isValid: boolean
  isDisabled: boolean
}

export type DateTimeSegment = DateTimeReadOnlySegment | DateTimeEditableSegment

export const DateTimeEditableSegmentKind: Record<DateTimeEditableSegmentTypes, number> = {
  dayPeriod: 1 << 0,
  second: 1 << 1,
  minute: 1 << 2,
  hour: 1 << 3,
  day: 1 << 4,
  month: 1 << 5,
  year: 1 << 6,
}

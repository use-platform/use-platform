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

export interface DateTimeEditableSegment {
  type: DateTimeEditableSegmentTypes
  text: string
  value: number | null
  min: number
  max: number
  isEditable: true
  isPlaceholder: boolean
  isValid: boolean
  isDisabled: boolean
}

export type DateTimeSegment = DateTimeReadOnlySegment | DateTimeEditableSegment

export interface DateTimeChangeEvent {
  value: Date | null
}

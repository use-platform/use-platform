import { clamp } from '../../../libs/utils'
import { DateLike, DateTimeEditableSegmentTypes } from '../types'

export enum DateComponent {
  dayPeriod = 1 << 0,
  second = 1 << 1,
  minute = 1 << 2,
  hour = 1 << 3,
  day = 1 << 4,
  month = 1 << 5,
  year = 1 << 6,
}

type DateComponentsLike = {
  [P in DateTimeEditableSegmentTypes]?: number | null
}

type DateComponentInternalType = Exclude<DateTimeEditableSegmentTypes, 'dayPeriod'>

type DateComponentsInternal = {
  [P in DateComponentInternalType]: number | null
}

const MIN_VALUES: Record<DateComponentInternalType, number> = {
  second: 0,
  minute: 0,
  hour: 0,
  day: 1,
  month: 1,
  year: 1,
}

const MAX_VALUES: Record<DateComponentInternalType, number> = {
  second: 59,
  minute: 59,
  hour: 23,
  day: 31,
  month: 12,
  year: 9999,
}

export class DateComponents {
  static from(date: DateLike | null = null) {
    if (date === null) {
      return new DateComponents()
    }

    const value = new Date(date)
    const hour = value.getHours()

    return new DateComponents({
      dayPeriod: hour <= 12 ? 1 : 2,
      second: value.getSeconds(),
      minute: value.getMinutes(),
      hour,
      day: value.getDate(),
      month: value.getMonth() + 1,
      year: value.getFullYear(),
    })
  }

  static isSame(type: DateTimeEditableSegmentTypes, a: DateComponents, b: DateComponents) {
    switch (type) {
      case 'year':
        return isSameYear(a, b)

      case 'month':
        return isSameMonth(a, b)

      case 'day':
        return isSameDay(a, b)

      case 'hour':
        return isSameHour(a, b)

      case 'minute':
        return isSameMinute(a, b)

      case 'second':
        return isSameSecond(a, b)

      case 'dayPeriod':
        return isSameDay(a, b) && isSameDateComponent('dayPeriod', a, b)
    }
  }

  static isEqual(a: DateComponents, b: DateComponents) {
    return isSameSecond(a, b)
  }

  static isDateComponentType(type: string): type is DateTimeEditableSegmentTypes {
    return type in DateComponent
  }

  private components: DateComponentsInternal = {
    day: null,
    hour: null,
    minute: null,
    second: null,
    month: null,
    year: null,
  }

  private filledComponentsMask: DateComponent = 0

  constructor(components: DateComponentsLike = {}) {
    this.set('day', components.day)
    this.set('hour', components.hour)
    this.set('dayPeriod', components.dayPeriod)
    this.set('minute', components.minute)
    this.set('second', components.second)
    this.set('month', components.month)
    this.set('year', components.year)
  }

  get(type: DateTimeEditableSegmentTypes): number | null
  get(type: DateTimeEditableSegmentTypes, defaultValue: number): number
  get(type: DateTimeEditableSegmentTypes, defaultValue: number | null | undefined): number | null
  get(type: DateTimeEditableSegmentTypes, defaultValue?: number | null): number | null {
    switch (type) {
      case 'dayPeriod':
        const { hour } = this.components

        if (hour === null) {
          return defaultValue ?? null
        }

        return hour < 12 ? 1 : 2

      default:
        return this.components[type] ?? defaultValue ?? null
    }
  }

  has(components: DateComponent) {
    return (this.filledComponentsMask & components) === components
  }

  with(type: DateTimeEditableSegmentTypes, value: number | null) {
    return new DateComponents({ ...this.components, [type]: value })
  }

  toDate(defaultDate: Date) {
    const month = this.get('month', defaultDate.getMonth() + 1) - 1
    const date = new Date()

    date.setFullYear(
      this.get('year', defaultDate.getFullYear()),
      month,
      this.get('day', defaultDate.getDate()),
    )
    date.setHours(
      this.get('hour', defaultDate.getHours()),
      this.get('minute', defaultDate.getMinutes()),
      this.get('second', defaultDate.getSeconds()),
      0,
    )

    if (date.getMonth() !== month) {
      date.setDate(0)
    }

    return date
  }

  private set(type: DateTimeEditableSegmentTypes, value: number | null = null) {
    switch (type) {
      case 'dayPeriod':
        if (value !== null) {
          const hours = this.get('hour', 0)
          const wasPM = hours >= 12
          const isPM = value > 1

          if (isPM !== wasPM) {
            this.components.hour = wasPM ? hours - 12 : hours + 12
          } else if (!this.has(DateComponent.hour)) {
            this.components.hour = 0
          }

          this.invalidateMask('hour', this.get('hour'))
        }
        break

      default:
        this.components[type] =
          value === null ? null : clamp(value, MIN_VALUES[type], MAX_VALUES[type])
    }

    this.invalidateMask(type, this.get(type))
  }

  private invalidateMask(type: DateTimeEditableSegmentTypes, value: number | null) {
    if (value === null) {
      this.filledComponentsMask &= ~DateComponent[type]
    } else {
      this.filledComponentsMask |= DateComponent[type]
    }
  }
}

function isSameDateComponent(
  type: DateTimeEditableSegmentTypes,
  a: DateComponents,
  b: DateComponents,
) {
  return a.get(type) === b.get(type)
}

function isSameYear(a: DateComponents, b: DateComponents) {
  return isSameDateComponent('year', a, b)
}

function isSameMonth(a: DateComponents, b: DateComponents) {
  return isSameYear(a, b) && isSameDateComponent('month', a, b)
}

function isSameDay(a: DateComponents, b: DateComponents) {
  return isSameMonth(a, b) && isSameDateComponent('day', a, b)
}

function isSameHour(a: DateComponents, b: DateComponents) {
  return isSameDay(a, b) && isSameDateComponent('hour', a, b)
}

function isSameMinute(a: DateComponents, b: DateComponents) {
  return isSameHour(a, b) && isSameDateComponent('minute', a, b)
}

function isSameSecond(a: DateComponents, b: DateComponents) {
  return isSameMinute(a, b) && isSameDateComponent('second', a, b)
}

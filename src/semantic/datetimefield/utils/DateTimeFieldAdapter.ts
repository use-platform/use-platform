import { clamp, isInRange } from '../../../libs/utils'
import { getDaysInMonth, getTime, startOfYear } from '../../../libs/date'
import { DateLike } from '../../../shared/types'
import { DateTimeSegment, DateTimeEditableSegmentTypes } from '../types'
import { MAX_DEFAULT_DATE, MIN_DEFAULT_DATE } from '../constants'
import { formatToParts, getResolvedOptions } from './format'
import { stepValue } from './segment'
import { DateComponent, DateComponents } from './DateComponents'

export interface DateTimeFieldAdapterOptions {
  formatter: Intl.DateTimeFormat
  min?: DateLike
  max?: DateLike
  placeholder?: DateLike
}

export class DateTimeFieldAdapter {
  readonly resolvedOptions: Intl.ResolvedDateTimeFormatOptions

  readonly formatter: Intl.DateTimeFormat

  readonly min: DateComponents

  readonly minTime: number

  readonly max: DateComponents

  readonly maxTime: number

  readonly placeholder: number

  readonly requiredSegments: DateComponent

  readonly placeholderParts: Intl.DateTimeFormatPart[]

  private minSpecified: boolean

  private maxSpecified: boolean

  private numberFormatter: Intl.NumberFormat

  private baseDate: Date

  constructor(options: DateTimeFieldAdapterOptions) {
    const { formatter, min, max, placeholder } = options
    const baseDate = startOfYear(new Date())

    // public
    this.formatter = formatter
    this.resolvedOptions = getResolvedOptions(formatter)
    this.minSpecified = Boolean(min ?? false)
    this.maxSpecified = Boolean(max ?? false)
    this.minTime = getTime(min ?? MIN_DEFAULT_DATE)
    this.maxTime = getTime(max ?? MAX_DEFAULT_DATE)
    this.min = DateComponents.from(this.minTime)
    this.max = DateComponents.from(this.maxTime)
    this.placeholder = getTime(placeholder ?? baseDate)

    // private
    this.numberFormatter = new Intl.NumberFormat(this.resolvedOptions.locale, {
      useGrouping: false,
    })
    this.placeholderParts = formatToParts(this.formatter, this.placeholder)
    this.requiredSegments = this.getSegmentsMaskFromFormatParts(this.placeholderParts)
    this.baseDate = baseDate
  }

  getSegments(dateComponents: DateComponents) {
    return this.formatToParts(dateComponents).map<DateTimeSegment>((part) => {
      if (!DateComponents.isDateComponentType(part.type)) {
        return {
          type: part.type,
          text: part.value,
          isEditable: false,
        }
      }

      const value = dateComponents.get(part.type)
      const { min, max } = this.getLimits(dateComponents, part.type)
      const isPlaceholder = value === null
      const isValid = value === null || isInRange(value, min, max)
      const isDisabled = !isPlaceholder && isValid && min === max

      return {
        type: part.type,
        text: part.value,
        isEditable: true,
        value,
        min,
        max,
        isDisabled,
        isValid,
        isPlaceholder,
      }
    })
  }

  getLimits(dateComponents: DateComponents, type: DateTimeEditableSegmentTypes) {
    const limits = { min: 0, max: 0 }

    switch (type) {
      case 'year':
        limits.min = this.min.get('year')!
        limits.max = this.max.get('year')!
        break

      case 'month':
        limits.min = 1
        limits.max = 12

        if (DateComponents.isSame('year', dateComponents, this.min)) {
          limits.min = this.min.get('month')!
        }

        if (DateComponents.isSame('year', dateComponents, this.max)) {
          limits.max = this.max.get('month')!
        }

        break

      case 'day':
        limits.min = 1
        limits.max = 31

        if (dateComponents.has(DateComponent.year | DateComponent.month)) {
          const date = new Date(dateComponents.get('year')!, dateComponents.get('month')! - 1)
          limits.max = getDaysInMonth(date)
        }

        if (DateComponents.isSame('month', dateComponents, this.min)) {
          limits.min = this.min.get('day')!
        }

        if (DateComponents.isSame('month', dateComponents, this.max)) {
          limits.max = this.max.get('day')!
        }

        break

      case 'hour':
        limits.min = 0
        limits.max = 23

        if (DateComponents.isSame('day', dateComponents, this.min)) {
          limits.min = this.min.get('hour')!
        }

        if (DateComponents.isSame('day', dateComponents, this.max)) {
          limits.max = this.max.get('hour')!
        }

        break

      case 'dayPeriod':
        limits.min = 1
        limits.max = 2

        if (DateComponents.isSame('day', dateComponents, this.min)) {
          limits.min = this.min.get('dayPeriod')!
        }

        if (DateComponents.isSame('day', dateComponents, this.max)) {
          limits.max = this.max.get('dayPeriod')!
        }

        break

      case 'minute':
        limits.min = 0
        limits.max = 59

        if (DateComponents.isSame('hour', dateComponents, this.min)) {
          limits.min = this.min.get('minute')!
        }

        if (DateComponents.isSame('hour', dateComponents, this.max)) {
          limits.max = this.max.get('minute')!
        }

        break

      case 'second':
        limits.min = 0
        limits.max = 59

        if (DateComponents.isSame('minute', dateComponents, this.min)) {
          limits.min = this.min.get('second')!
        }

        if (DateComponents.isSame('minute', dateComponents, this.max)) {
          limits.max = this.max.get('second')!
        }

        break
    }

    return limits
  }

  moveByStep(dateComponents: DateComponents, type: DateTimeEditableSegmentTypes, step: number) {
    const segmentValue = dateComponents.get(type)
    const { min, max } = this.getLimits(dateComponents, type)

    if (segmentValue === null || segmentValue < min || segmentValue > max) {
      return this.getInitialValueForStep(type, step, min, max)
    }

    return stepValue(
      clamp(segmentValue, min, max),
      step,
      min,
      max,
      type === 'hour' || type === 'minute' || type === 'second',
    )
  }

  setSegmentValue(
    dateComponents: DateComponents,
    type: DateTimeEditableSegmentTypes,
    segmentValue: number | null,
  ) {
    if (segmentValue !== null) {
      const limits = this.getLimits(dateComponents, type)

      segmentValue = clamp(segmentValue, limits.min, limits.max)
    }

    return dateComponents.with(type, segmentValue)
  }

  toDate(dateComponents: DateComponents) {
    const date = dateComponents.toDate(this.baseDate)
    const day = date.getDate()

    if (
      dateComponents.has(this.requiredSegments) &&
      day === dateComponents.get('day', day) &&
      isInRange(date.getTime(), this.minTime, this.maxTime)
    ) {
      return date
    }

    return null
  }

  normalizeDateComponents(dateComponents: DateComponents) {
    const types: DateTimeEditableSegmentTypes[] = [
      'year',
      'minute',
      'day',
      'hour',
      'month',
      'second',
    ]

    let nextDateComponents = dateComponents
    for (const type of types) {
      const value = dateComponents.get(type)

      if (value === null && DateComponents.isSame(type, this.min, this.max)) {
        nextDateComponents = nextDateComponents.with(type, this.min.get(type))
      }
    }

    return nextDateComponents !== dateComponents ? nextDateComponents : dateComponents
  }

  private formatValue(value: number, format: '2-digit' | 'numeric') {
    const formatted = this.numberFormatter.format(value)

    if (format === 'numeric') {
      return formatted
    }

    return formatted.padStart(2, this.numberFormatter.format(0))
  }

  private getInitialValueForStep(
    type: DateTimeEditableSegmentTypes,
    step: number,
    min: number,
    max: number,
  ) {
    if (type === 'year') {
      // if the user has specified a minimum value, then we use it
      if (step > 0 && this.minSpecified) {
        return min
      }

      // if the user has specified a maximum value, then we use it
      if (step < 0 && this.maxSpecified) {
        return max
      }

      return clamp(this.baseDate.getFullYear(), min, max)
    }

    return step > 0 ? this.min.get(type, min) : this.max.get(type, max)
  }

  private getSegmentsMaskFromFormatParts(parts: Intl.DateTimeFormatPart[]) {
    return parts.reduce((state, part) => {
      if (DateComponents.isDateComponentType(part.type)) {
        return state | DateComponent[part.type]
      }

      return state
    }, 0)
  }

  private formatToParts(dateComponents: DateComponents) {
    const parts = formatToParts(this.formatter, dateComponents.toDate(new Date(this.placeholder)))

    return parts.map((part, index) => {
      if (DateComponents.isDateComponentType(part.type)) {
        const value = dateComponents.get(part.type)

        if (value === null) {
          return this.placeholderParts[index]
        }

        if (part.type === 'day') {
          const format = this.resolvedOptions.day as '2-digit' | 'numeric'

          return {
            ...part,
            value: this.formatValue(value, format),
          }
        }
      }

      return part
    })
  }
}

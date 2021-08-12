import {
  endOfDay,
  endOfHour,
  endOfMinute,
  endOfMonth,
  endOfYear,
  getDate,
  getDaysInMonth,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getTime,
  getYear,
  set,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfYear,
} from '../../../libs/date'
import {
  DateLike,
  DateTimeEditableSegment,
  DateTimeEditableSegmentKind,
  DateTimeEditableSegmentTypes,
  DateTimeSegment,
  DateTimeSegmentLimits,
  DateTimeSegmentTypes,
} from '../types'
import { formatToParts } from './format'

// Converts unicode number strings to real JS numbers.
// Numbers can be displayed and typed in many number systems, but JS
// only understands latin numbers.
// See https://www.fileformat.info/info/unicode/category/Nd/list.htm
// for a list of unicode numeric characters.
// Currently only Arabic and Latin numbers are supported, but more
// could be added here in the future.
// Keep this in sync with `isNumeric` below.
function parseNumber(str: string): number {
  str = str
    // Arabic Indic
    .replace(/[\u0660-\u0669]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    // Extended Arabic Indic
    .replace(/[\u06f0-\u06f9]/g, (c) => String(c.charCodeAt(0) - 0x06f0))

  return Number(str)
}

// Checks whether a unicode string could be converted to a number.
// Keep this in sync with `parseNumber` above.
function isNumeric(str: string) {
  return /^[0-9\u0660-\u0669\u06f0-\u06f9]+$/.test(str)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function isEditableSegmentType(type: DateTimeSegmentTypes): type is DateTimeEditableSegmentTypes {
  return type in DateTimeEditableSegmentKind
}

export function isPlaceholderSegmentType(
  state: number,
  type: DateTimeEditableSegmentTypes,
): boolean {
  return (state & DateTimeEditableSegmentKind[type]) === 0
}

export function resolveValidSegmentsState(formatter: Intl.DateTimeFormat) {
  const parts = formatToParts(formatter)

  return parts.reduce((state, segment) => {
    if (isEditableSegmentType(segment.type)) {
      return state | DateTimeEditableSegmentKind[segment.type]
    }

    return state
  }, 0)
}

function resolveSegmentTimeLimits(
  type: DateTimeEditableSegmentTypes,
  value: DateLike,
  min: DateLike,
  max: DateLike,
) {
  const minTime = getTime(min)
  const maxTime = getTime(max)
  const clamped = Math.min(Math.max(getTime(value), minTime), maxTime)

  let start: Date
  let end: Date

  switch (type) {
    case 'day':
      start = startOfMonth(clamped)
      end = endOfMonth(clamped)
      break

    case 'dayPeriod':
    case 'hour':
      start = startOfDay(clamped)
      end = endOfDay(clamped)
      break

    case 'minute':
      start = startOfHour(clamped)
      end = endOfHour(clamped)
      break

    case 'month':
      start = startOfYear(clamped)
      end = endOfYear(clamped)
      break

    case 'second':
      start = startOfMinute(clamped)
      end = endOfMinute(clamped)
      break

    case 'year':
      start = new Date(min)
      end = new Date(max)
      break
  }

  return [Math.max(minTime, getTime(start)), Math.min(maxTime, getTime(end))] as const
}

export function resolveSegmentLimits(
  type: DateTimeEditableSegmentTypes,
  value: DateLike,
  min: DateLike,
  max: DateLike,
): DateTimeSegmentLimits {
  const limits: DateTimeSegmentLimits = {
    min: 0,
    max: 0,
    value: 0,
  }
  const [minTime, maxTime] = resolveSegmentTimeLimits(type, value, min, max)

  switch (type) {
    case 'day':
      limits.value = getDate(value)
      limits.min = getDate(minTime)
      limits.max = getDate(maxTime)
      break

    case 'dayPeriod':
      limits.value = getHours(value) >= 12 ? 2 : 1
      limits.min = getHours(minTime) >= 12 ? 2 : 1
      limits.max = getHours(maxTime) >= 12 ? 2 : 1
      break

    case 'hour':
      limits.value = getHours(value)
      limits.min = getHours(minTime)
      limits.max = getHours(maxTime)
      break

    case 'minute':
      limits.value = getMinutes(value)
      limits.min = getMinutes(minTime)
      limits.max = getMinutes(maxTime)
      break

    case 'month':
      limits.value = getMonth(value) + 1
      limits.min = getMonth(minTime) + 1
      limits.max = getMonth(maxTime) + 1
      break

    case 'second':
      limits.value = getSeconds(value)
      limits.min = getSeconds(minTime)
      limits.max = getSeconds(maxTime)
      break

    case 'year':
      limits.value = getYear(value)
      limits.min = getYear(minTime)
      limits.max = getYear(maxTime)
      break

    default:
      throw new Error('Invalid editable segment type')
  }

  return limits
}

function resolveDateTimeSegment(
  part: Intl.DateTimeFormatPart,
  value: DateLike,
  min: DateLike,
  max: DateLike,
  segmentsState: number,
): DateTimeSegment {
  if (!isEditableSegmentType(part.type)) {
    return {
      type: part.type,
      text: part.value,
      isEditable: false,
    }
  }

  const limits = resolveSegmentLimits(part.type, value, min, max)
  const isPlaceholder = isPlaceholderSegmentType(segmentsState, part.type)
  const isValid = isPlaceholder || (limits.value >= limits.min && limits.value <= limits.max)
  const isDisabled = !isPlaceholder && limits.min === limits.max && isValid

  const segment: DateTimeEditableSegment = {
    type: part.type,
    text: part.value,
    isEditable: true,
    isPlaceholder,
    isValid,
    isDisabled,
    ...limits,
  }

  return segment
}

export function resolveDateTimeSegments(
  formatter: Intl.DateTimeFormat,
  value: DateLike,
  min: DateLike,
  max: DateLike,
  segmentsState: number,
) {
  const parts = formatToParts(formatter, value)

  return parts.map((part) => {
    return resolveDateTimeSegment(part, value, min, max, segmentsState)
  })
}

interface StepValueOptions {
  value: number
  step: number
  min: number
  max: number
  round?: boolean
}

export function stepValue(options: StepValueOptions) {
  const { value, step, min, max, round = false } = options
  let newValue = value

  if (round) {
    newValue += step > 0 ? 1 : -1
    const div = Math.abs(step)
    const mathRound = step > 0 ? Math.ceil : Math.floor

    newValue = mathRound(newValue / div) * div
  } else {
    newValue += step

    if (newValue < min) {
      newValue = max - (min - newValue - 1)
    } else if (newValue > max) {
      newValue = min + (newValue - max - 1)
    }
  }

  if (newValue < min || newValue > max) {
    return step > 0 ? min : max
  }

  return newValue
}

export function parseSegmentValue(type: DateTimeEditableSegmentTypes, str: string): number | null {
  if (isNumeric(str) || /^[ap]$/i.test(str)) {
    const numberValue = parseNumber(str)

    if (isFinite(numberValue)) {
      return numberValue
    }

    if (type === 'dayPeriod') {
      const lower = str.toLowerCase()
      if (lower === 'a') {
        return 1
      }

      if (lower === 'p') {
        return 2
      }
    }
  }

  return null
}

export function setDateSegmentValue(
  value: DateLike,
  type: DateTimeEditableSegmentTypes,
  segmentValue: number,
): Date {
  const v = new Date(value)

  switch (type) {
    case 'day':
      return set(v, { date: clamp(segmentValue, 1, getDaysInMonth(value)) })

    case 'dayPeriod': {
      const hours = getHours(v)
      const wasPM = hours >= 12
      const isPM = segmentValue > 1

      if (isPM === wasPM) {
        return v
      }

      return set(v, { hours: wasPM ? hours - 12 : hours + 12 })
    }

    case 'hour':
      return set(v, { hours: clamp(segmentValue, 0, 23) })

    case 'minute':
      return set(v, { minutes: clamp(segmentValue, 0, 59) })

    case 'second':
      return set(v, { seconds: clamp(segmentValue, 0, 59) })

    case 'month':
      return set(v, { month: clamp(segmentValue, 1, 12) - 1 })

    case 'year':
      return set(v, { year: clamp(segmentValue, 1, 9999) })
  }
}

export function getAriaValueAttributes(
  segment: DateTimeEditableSegment,
  options: Intl.ResolvedDateTimeFormatOptions,
) {
  const { value, min, max } = segment
  const attrs = { value, min, max }

  if (segment.type !== 'hour') {
    return attrs
  }

  const { hourCycle } = options

  switch (hourCycle) {
    case 'h11':
      attrs.value = value % 12
      attrs.min = 0
      attrs.max = 11

      if (max < 12) {
        attrs.min = min
        attrs.max = max
      } else if (min >= 12) {
        attrs.min = min - 12
        attrs.max = max - 12
      }
      break

    case 'h12':
      attrs.value = value % 12 || 12
      attrs.min = 1
      attrs.max = 12

      if (max < 12) {
        attrs.min = min
        attrs.max = max
      } else if (min >= 12) {
        attrs.min = min - 12
        attrs.max = max - 12
      }

      attrs.min = attrs.min || 12
      attrs.max = attrs.max || 12
      if (attrs.min > attrs.max) {
        attrs.min = 1
        attrs.max = 12
      }
      break

    case 'h24':
      attrs.value = value || 24
      attrs.min = min || 24
      attrs.max = max || 24

      if (attrs.min > attrs.max) {
        attrs.min = 1
        attrs.max = 24
      }
      break

    case 'h23':
      attrs.value = value
      attrs.min = min
      attrs.max = max
      break

    default:
      throw new Error('Invalid hour cycle')
  }

  return attrs
}

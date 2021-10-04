import { DateTimeEditableSegment, DateTimeEditableSegmentTypes } from '../types'

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

export function stepValue(value: number, step: number, min: number, max: number, round = false) {
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

    if (type === 'dayPeriod') {
      const lower = str.toLowerCase()

      if (lower === 'a' || numberValue === 1) {
        return 1
      }

      if (lower === 'p' || numberValue === 2) {
        return 2
      }

      return null
    }

    if (isFinite(numberValue)) {
      return numberValue
    }
  }

  return null
}

export function getAriaValueAttributes(
  segment: DateTimeEditableSegment,
  options: Intl.ResolvedDateTimeFormatOptions,
) {
  const { value, min, max } = segment
  const attrs = { value: value ?? undefined, min, max }

  if (segment.type !== 'hour') {
    return attrs
  }

  const { hourCycle } = options
  const hours = value ?? 0

  switch (hourCycle) {
    case 'h11':
      attrs.value = hours % 12
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
      attrs.value = hours % 12 || 12
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
      attrs.value = hours || 24
      attrs.min = min || 24
      attrs.max = max || 24

      if (attrs.min > attrs.max) {
        attrs.min = 1
        attrs.max = 24
      }
      break

    case 'h23':
      attrs.value = hours
      attrs.min = min
      attrs.max = max
      break

    default:
      throw new Error('Invalid hour cycle')
  }

  return attrs
}

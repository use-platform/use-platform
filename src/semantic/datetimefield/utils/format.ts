import { DateLike } from '../../../shared/types'

export function getResolvedOptions(
  formatter: Intl.DateTimeFormat,
): Intl.ResolvedDateTimeFormatOptions {
  const options = formatter.resolvedOptions()

  // NOTE: hourCycle supports only modern browsers
  if (options.hour !== undefined && options.hourCycle === undefined) {
    options.hourCycle = options.hour12 ? 'h12' : 'h23'
  }

  return options
}

export function formatToParts(
  formatter: Intl.DateTimeFormat,
  value?: DateLike,
): Intl.DateTimeFormatPart[] {
  const parts = formatter.formatToParts(value)

  return parts.map<Intl.DateTimeFormatPart>((part) => {
    // NOTE: chrome < 71 bug https://bugs.chromium.org/p/chromium/issues/detail?id=865351
    // @ts-expect-error
    if (part.type === 'dayperiod') {
      part.type = 'dayPeriod'
    }

    return part
  })
}

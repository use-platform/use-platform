import { useMemo } from 'react'

import { useLocale } from './useLocale'

const formatterCache = new Map<string, Intl.DateTimeFormat>()

export function useDateFormatter(options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const { locale } = useLocale()

  const cacheKey = useMemo(() => getCacheKey(locale, options), [locale, options])
  const cacheValue = formatterCache.get(cacheKey)

  if (cacheValue) {
    return cacheValue
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  formatterCache.set(cacheKey, formatter)

  return formatter
}

function getCacheKey(locale: string, options?: Intl.DateTimeFormatOptions): string {
  let salt = ''

  if (options !== undefined) {
    salt = Object.keys(options)
      .map((key) => [key, options[key as keyof Intl.DateTimeFormatOptions]] as const)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .join()
  }

  return locale + salt
}

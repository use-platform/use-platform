import { useContext, useMemo } from 'react'

import { LocaleContext } from './context'
import { LocaleData } from './types'
import { getLocaleData } from './getLocaleData'

export function useLocale(): LocaleData {
  const contextLocale = useContext(LocaleContext)
  const result = useMemo(() => getLocaleData(contextLocale), [contextLocale])

  return result
}

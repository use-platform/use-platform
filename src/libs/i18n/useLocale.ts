import { useContext, useMemo } from 'react'

import { LocaleContext } from './context'
import { getLocaleData } from './getLocaleData'
import { LocaleData } from './types'

export function useLocale(): LocaleData {
  const contextLocale = useContext(LocaleContext)
  const result = useMemo(() => getLocaleData(contextLocale), [contextLocale])

  return result
}

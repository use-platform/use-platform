import React, { FC } from 'react'

import { LocaleContext } from './context'

export interface LocaleProviderProps {
  locale: string
  children?: React.ReactNode
}

export const LocaleProvider: FC<LocaleProviderProps> = (props) => {
  const { locale, children } = props

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

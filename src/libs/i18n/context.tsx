import { createContext } from 'react'

const defaultLocale = (typeof navigator !== 'undefined' && navigator.language) || 'ru-RU'

export const LocaleContext = createContext<string>(defaultLocale)

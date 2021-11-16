import { createContext } from 'react'
import { UseRadioGroupStateResult } from './useRadioGroupState'

export const RadioGroupContext = createContext<UseRadioGroupStateResult | null>(null)

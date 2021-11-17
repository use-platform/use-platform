import { useContext } from 'react'

import { RadioGroupContext } from './RadioGroupContext'

export function useRadioGroupContext() {
  return useContext(RadioGroupContext)
}

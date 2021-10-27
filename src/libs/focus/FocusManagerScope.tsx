import React, { createContext, FC, RefObject, useContext, useMemo } from 'react'

import { createFocusManager, FocusManager } from './createFocusManager'

const FocusManagerContext = createContext<FocusManager | null>(null)

export interface FocusManagerScopeProps {
  scopeRef: RefObject<HTMLElement>
}

export const FocusManagerScope: FC<FocusManagerScopeProps> = (props) => {
  const { scopeRef, children } = props

  const manager = useMemo(() => createFocusManager(scopeRef), [scopeRef])

  return <FocusManagerContext.Provider value={manager}>{children}</FocusManagerContext.Provider>
}

export function useFocusManager() {
  const manager = useContext(FocusManagerContext)

  if (!manager) {
    throw new Error(
      'Could not find focus manager context value. Please ensure the component is wrapped in a <FocusManagerScope />',
    )
  }

  return manager
}

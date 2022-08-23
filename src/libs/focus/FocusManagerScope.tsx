import { FC, ReactNode, RefObject, createContext, useContext, useEffect, useMemo } from 'react'

import { FocusManager, createFocusManager } from './createFocusManager'

const FocusManagerContext = createContext<FocusManager | null>(null)

export interface FocusManagerScopeProps {
  scopeRef: RefObject<HTMLElement>
  autoFocus?: boolean
  children?: ReactNode
}

export const FocusManagerScope: FC<FocusManagerScopeProps> = (props) => {
  const { scopeRef, autoFocus, children } = props

  const manager = useMemo(() => createFocusManager(scopeRef), [scopeRef])

  useEffect(() => {
    if (autoFocus) {
      manager.focusFirst()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

import React, { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react'

export interface SSRContextValue {
  /**
   * Current counter value into context
   */
  value: number
  /**
   * Context ID, used for nested `SSRProvider`
   */
  id: number
}

/**
 * @internal
 */
export const initialContextValue: SSRContextValue = { value: 0, id: 0 }

export const SSRContext = createContext(initialContextValue)

/**
 * Provider that synchronizes the layout data when the application is hydrated.
 *
 * @example
 * const Root = () => (
 *   <SSRProvider>
 *     <App />
 *   </SSRProvider>
 * )
 */
export const SSRProvider: FC<PropsWithChildren> = ({ children }) => {
  const context = useContext(SSRContext)

  const value = useMemo(() => {
    return {
      value: 0,
      id: context === initialContextValue ? 0 : ++context.id,
    }
  }, [context])

  return <SSRContext.Provider value={value}>{children}</SSRContext.Provider>
}

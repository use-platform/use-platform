import { useContext, useState } from 'react'

import { SSRContext, initialContextValue } from '../ssr'
import { canUseDom } from '../dom-utils'

/**
 * React-hook for generate uniq identifier.
 *
 * When using ssr in a project, you must wrap the application in
 * `SSRProvider` for id synchronization between the server and the client.
 *
 * @param customId - Custom uniq id
 *
 * @example
 * const id = useUniqId()
 */
export function useUniqId(customId?: string): string {
  const context = useContext(SSRContext)
  const [id] = useState(() => `xuniq-${context.id}-${++context.value}`)

  console.assert(
    canUseDom || context !== initialContextValue,
    'When using ssr in a project, you must wrap the application in <SSRProvider>' +
      ' for id synchronization between the server and the client.',
  )

  return customId || id
}

import userEvent from '@testing-library/user-event'

import { fireEvent as fireEventBase } from './createClientRender'

export { renderHook } from '@testing-library/react-hooks'

export * from './createClientRender'
export * from './createServerRender'
export * from './events'

export const fireEvent = { ...fireEventBase, ...userEvent.setup() }

export function createContainer(html: string): HTMLDivElement {
  const container = document.createElement('div')
  container.innerHTML = html

  return container
}

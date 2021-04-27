export { default as userEvent } from '@testing-library/user-event'

export * from './createClientRender'
export * from './createServerRender'
export * from './events'

export function createContainer(html: string): HTMLDivElement {
  const container = document.createElement('div')
  container.innerHTML = html

  return container
}

/**
 * Checks, can use DOM api in current environment.
 *
 * @example
 * if (canUseDom) {
 *   document.querySelector('...')
 * }
 */
export const canUseDom =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

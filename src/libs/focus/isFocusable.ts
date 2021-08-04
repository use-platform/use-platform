import { isHidden, isHiddenInput, matches } from './utils'

const FOCUSABLE_SELECTORS = [
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'audio[controls]',
  'button',
  'details',
  'details>summary:first-of-type',
  'input',
  'select',
  'textarea',
  'video[controls]',
  'iframe',
].join(',')

export function isFocusable(node: HTMLElement) {
  if (
    !matches(node, FOCUSABLE_SELECTORS) ||
    isHiddenInput(node) ||
    (node as any).disabled ||
    isHidden(node)
  ) {
    return false
  }

  return true
}

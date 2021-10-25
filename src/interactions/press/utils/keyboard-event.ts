export function isCheckableInput(element: HTMLElement): boolean {
  const type = element.getAttribute('type')

  return element.tagName === 'INPUT' && (type === 'checkbox' || type === 'radio')
}

export function isValidKeyboardEvent(event: KeyboardEvent): boolean {
  const { key, target } = event
  const element = target as HTMLElement

  const role = element.getAttribute('role')
  const isLink = element.tagName === 'A' && element.hasAttribute('href')
  // Use getAttribute instead isContentEditable because jsdom doesn't support this attr.
  const contentEditable = element.getAttribute('contenteditable')

  // Accessibility for keyboards. Space and Enter only ("Spacebar" is for IE 11).
  return (
    // An checkable input should only trigger with Space key.
    ((!isCheckableInput(element) && key === 'Enter') || key === ' ' || key === 'Spacebar') &&
    contentEditable !== 'true' &&
    // A link with a valid href should be handled natively,
    // unless it also has role='button' and was triggered using Space.
    (!isLink || (role === 'button' && key !== 'Enter')) &&
    // An element with role='link' should only trigger with Enter key.
    !(role === 'link' && key !== 'Enter')
  )
}

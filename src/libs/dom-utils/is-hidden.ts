export function isHidden(node: Element) {
  if (window.getComputedStyle(node).visibility === 'hidden') {
    return true
  }

  let parent: Element | null = node
  while (parent) {
    if (window.getComputedStyle(parent).display === 'none') {
      return true
    }

    parent = parent.parentElement
  }

  return false
}

let protoMatches: Element['matches'] | null = null
if (typeof Element !== 'undefined') {
  protoMatches =
    Element.prototype.matches ||
    Element.prototype.webkitMatchesSelector ||
    // @ts-expect-error
    Element.prototype.matchesSelector ||
    // @ts-expect-error
    Element.prototype.mozMatchesSelector ||
    // @ts-expect-error
    Element.prototype.msMatchesSelector
}

export function matches(node: Element, selectors: string) {
  return protoMatches ? protoMatches.call(node, selectors) : false
}

export function isInput(node: HTMLElement): node is HTMLInputElement {
  return node.tagName === 'INPUT'
}

export function isIframe(node: HTMLElement): node is HTMLFrameElement {
  return node.tagName === 'IFRAME'
}

export function isHiddenInput(node: HTMLElement): node is HTMLInputElement {
  return isInput(node) && node.type === 'hidden'
}

export function isRadioInput(node: HTMLElement): node is HTMLInputElement {
  return isInput(node) && node.type === 'radio'
}

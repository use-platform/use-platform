import { ElementTreeWalker } from './ElementTreeWalker'
import { isIframe, isRadioInput } from './utils'

function getCheckedRadio(radio: HTMLInputElement) {
  if (radio.checked) {
    return radio
  }

  const walker = new ElementTreeWalker(radio.form || radio.ownerDocument.body, (element) => {
    return (
      isRadioInput(element) &&
      element.name === radio.name &&
      element.checked &&
      element.form === radio.form
    )
  })

  return walker.next()
}

function isTabbableRadio(radio: HTMLInputElement) {
  if (!radio.name) {
    return true
  }

  const checked = getCheckedRadio(radio)

  return !checked || checked === radio
}

export function adjustedTabIndex(node: HTMLElement) {
  if ((isRadioInput(node) && !isTabbableRadio(node)) || isIframe(node)) {
    return -1
  }

  const tabIndex = parseInt(node.getAttribute('tabindex') || '', 10)

  if (!isNaN(tabIndex)) {
    return tabIndex
  }

  // Use fallback value for dom nodes with `contentEditable`,
  // because browsers not returns correct `tabIndex` value.
  if (node.contentEditable === 'true') {
    return 0
  }

  // Use `tabIndex` fallback value for <details/>, <audio controls/> and <video controls/>,
  // because Chrome returns "-1" and Firefox returns "0" when `tabIndex` not set.
  if (
    (node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') &&
    node.getAttribute('tabindex') === null
  ) {
    return 0
  }

  return node.tabIndex
}

export function setCursorToEnd(element: HTMLInputElement | HTMLTextAreaElement) {
  const end = element.value.length
  element.setSelectionRange(end, end)
}

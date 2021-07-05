export function setCursorToEnd(element: HTMLInputElement | HTMLTextAreaElement | null) {
  if (!element) {
    return
  }

  const end = element.value.length
  element.setSelectionRange(end, end)
}

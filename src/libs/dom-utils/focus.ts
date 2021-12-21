interface ScrollableElement {
  element: HTMLElement
  scrollTop: number
  scrollLeft: number
}

let supportsPreventScrollCached: boolean | null = null

function supportsPreventScroll() {
  if (supportsPreventScrollCached === null) {
    supportsPreventScrollCached = false

    try {
      const element = document.createElement('div')

      element.focus({
        get preventScroll() {
          supportsPreventScrollCached = true

          return true
        },
      })
    } catch (e) {
      // ignore
    }
  }

  return supportsPreventScrollCached
}

function getScrollableElements(element: HTMLElement): ScrollableElement[] {
  const scrollableElements: ScrollableElement[] = []
  const rootScrollingElement = document.scrollingElement || document.documentElement

  let parent = element.parentNode
  while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) {
      scrollableElements.push({
        element: parent,
        scrollTop: parent.scrollTop,
        scrollLeft: parent.scrollLeft,
      })
    }
    parent = parent.parentNode
  }

  if (rootScrollingElement instanceof HTMLElement) {
    scrollableElements.push({
      element: rootScrollingElement,
      scrollTop: rootScrollingElement.scrollTop,
      scrollLeft: rootScrollingElement.scrollLeft,
    })
  }

  return scrollableElements
}

function restoreScrollPosition(scrollableElements: ScrollableElement[]) {
  for (const { element, scrollTop, scrollLeft } of scrollableElements) {
    element.scrollTop = scrollTop
    element.scrollLeft = scrollLeft
  }
}

export function focusWithoutScrolling(element: HTMLElement) {
  if (supportsPreventScroll()) {
    element.focus({ preventScroll: true })
  } else {
    const scrollableElements = getScrollableElements(element)
    element.focus()
    restoreScrollPosition(scrollableElements)
  }
}

export function focusElement(element?: HTMLElement | null, preventScroll?: boolean) {
  if (!element) {
    return
  }

  try {
    if (preventScroll) {
      focusWithoutScrolling(element)
    } else {
      element.focus()
    }
  } catch (_error) {
    // Ignore
  }
}

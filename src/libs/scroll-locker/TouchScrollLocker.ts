import { getScrollParent, isPassiveEventsSupported, isRootHTMLElement } from './utils'

interface ScrollLockState {
  count: number
  lastX: number
  lastY: number
  scrollable: HTMLElement | null
  scrollX: number
  scrollY: number
}

const LISTENER_OPTIONS = isPassiveEventsSupported() ? { passive: false } : undefined

const state: ScrollLockState = {
  count: 0,
  lastX: 0,
  lastY: 0,
  scrollable: null,
  scrollX: 0,
  scrollY: 0,
}

function onTouchStart(event: TouchEvent) {
  if (event.changedTouches.length === 1) {
    state.scrollable = getScrollParent(event.target as HTMLElement)

    if (isRootHTMLElement(state.scrollable)) {
      return
    }

    state.lastX = event.changedTouches[0].pageX
    state.lastY = event.changedTouches[0].pageY
  }
}

function onTouchMove(event: TouchEvent) {
  const { scrollable, lastX, lastY } = state

  if (event.changedTouches.length > 1) {
    return
  }

  if (!scrollable || isRootHTMLElement(scrollable)) {
    event.preventDefault()

    return
  }

  const x = event.changedTouches[0].pageX
  const y = event.changedTouches[0].pageY

  const isVertical = Math.abs(lastY - y) > Math.abs(lastX - x)

  const top = scrollable.scrollTop
  const bottom = scrollable.scrollHeight - scrollable.clientHeight
  const left = scrollable.scrollLeft
  const right = scrollable.scrollWidth - scrollable.clientWidth

  const isVertiacalScrolled =
    isVertical && ((top <= 0 && y > lastY) || (top >= bottom && y < lastY))

  const isHorizontalScrolled =
    !isVertical && ((left <= 0 && x > lastX) || (left >= right && x < lastX))

  if (isVertiacalScrolled || isHorizontalScrolled) {
    event.preventDefault()
  }

  state.lastX = x
  state.lastY = y
}

function onTouchEnd() {
  if (state.scrollable) {
    state.scrollable = null
  }
}

export function lock(container: HTMLElement) {
  if (!isRootHTMLElement(container)) {
    return
  }

  state.count++

  if (state.count === 1) {
    state.scrollX = window.pageXOffset
    state.scrollY = window.pageYOffset

    document.addEventListener('touchstart', onTouchStart, LISTENER_OPTIONS)
    document.addEventListener('touchmove', onTouchMove, LISTENER_OPTIONS)
    document.addEventListener('touchend', onTouchEnd, LISTENER_OPTIONS)
  }
}

export function unlock(container: HTMLElement) {
  if (!isRootHTMLElement(container) || state.count === 0) {
    return
  }

  state.count--

  if (state.count === 0) {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)

    window.scrollTo(state.scrollX, state.scrollY)
  }
}

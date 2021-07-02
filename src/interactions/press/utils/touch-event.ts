export function getTouchFromEvent(event: TouchEvent): Touch | null {
  const { targetTouches } = event
  if (targetTouches.length > 0) {
    return targetTouches[0]
  }
  return null
}

export function getTouchById(event: TouchEvent, pointerId: number | null): Touch | null {
  const changedTouches = event.changedTouches
  for (let i = 0; i < changedTouches.length; i++) {
    const touch = changedTouches[i]
    if (touch.identifier === pointerId) {
      return touch
    }
  }
  return null
}

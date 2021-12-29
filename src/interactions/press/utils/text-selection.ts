type State = 'idle' | 'disabled' | 'restoring'

let state: State = 'idle'
let prevSelect = ''

function getUserSelect() {
  return (
    document.documentElement.style.userSelect || document.documentElement.style.webkitUserSelect
  )
}

function setUserSelect(value: string) {
  document.documentElement.style.userSelect = value
  document.documentElement.style.webkitUserSelect = value
}

export function disableTextSelection() {
  if (state === 'idle') {
    prevSelect = getUserSelect()
    setUserSelect('none')
  }

  state = 'disabled'
}

export function restoreTextSelection() {
  if (state !== 'disabled') {
    return
  }

  state = 'restoring'

  // There appears to be a delay on iOS where selection still might occur
  // after pointer up, so wait a bit before removing user-select.
  setTimeout(() => {
    // Wait for any CSS transitions to complete so we don't recompute style
    // for the whole page in the middle of the animation and cause jank.
    requestAnimationFrame(() => {
      if (state === 'restoring') {
        if (getUserSelect() === 'none') {
          setUserSelect(prevSelect)
        }

        prevSelect = ''
        state = 'idle'
      }
    })
  }, 300)
}

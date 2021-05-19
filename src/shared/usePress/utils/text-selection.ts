type State = 'default' | 'disabled' | 'restoring'

let state: State = 'default'
let prevSelect = ''

export function disableTextSelection() {
  if (state === 'default') {
    prevSelect = document.documentElement.style.userSelect
    document.documentElement.style.userSelect = 'none'
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
        if (document.documentElement.style.userSelect === 'none') {
          document.documentElement.style.userSelect = prevSelect
        }

        prevSelect = ''
        state = 'default'
      }
    })
  }, 300)
}

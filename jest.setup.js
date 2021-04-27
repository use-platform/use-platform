require('@testing-library/jest-dom/extend-expect')

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

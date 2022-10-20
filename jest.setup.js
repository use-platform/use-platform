require('@testing-library/jest-dom/extend-expect')

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

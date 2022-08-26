function testUserAgent(re: RegExp) {
  return typeof window !== 'undefined' && window.navigator != null
    ? re.test(window.navigator.userAgent)
    : false
}

export function isFirefox() {
  return testUserAgent(/Firefox/)
}

export function isIOS() {
  return (
    testUserAgent(/iphone|ipod|ipad/i) ||
    (testUserAgent(/macintosh/i) && navigator.maxTouchPoints > 1)
  )
}

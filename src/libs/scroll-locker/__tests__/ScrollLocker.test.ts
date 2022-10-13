import * as ScrollLocker from '../ScrollLocker'

describe('ScrollLocker', () => {
  test('Should correctly set the default value of `overflow` for `body`', () => {
    expect(document.body).not.toHaveStyle('overflow: hidden')

    ScrollLocker.lock()
    expect(document.body).toHaveStyle('overflow: hidden')

    ScrollLocker.unlock()
    expect(document.body).not.toHaveStyle('overflow: hidden')
  })

  test('Should correctly set the value of `overflow` for an arbitrary element', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    expect(container).not.toHaveStyle('overflow: hidden')

    ScrollLocker.lock(container)
    expect(container).toHaveStyle('overflow: hidden')

    ScrollLocker.unlock(container)
    expect(container).not.toHaveStyle('overflow: hidden')

    document.body.removeChild(container)
  })

  test('Should work correctly when calling `lock/unlock` on the same element multiple times', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    expect(container).not.toHaveStyle('overflow: hidden')

    ScrollLocker.lock(container)
    expect(container).toHaveStyle('overflow: hidden')

    ScrollLocker.lock(container)
    expect(container).toHaveStyle('overflow: hidden')

    ScrollLocker.unlock(container)
    expect(container).toHaveStyle('overflow: hidden')

    ScrollLocker.unlock(container)
    expect(container).not.toHaveStyle('overflow: hidden')

    document.body.removeChild(container)
  })

  test('Should set the original value of `overflow` on unlock', () => {
    const container = document.createElement('div')
    container.style.overflow = 'scroll'
    document.body.appendChild(container)

    ScrollLocker.lock(container)
    expect(container).toHaveStyle('overflow: hidden')

    ScrollLocker.unlock(container)
    expect(container).toHaveStyle('overflow: scroll')

    document.body.removeChild(container)
  })
})

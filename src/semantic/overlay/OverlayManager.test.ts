import { fireEvent } from '../../internal/testing'
import { OverlayManager } from './OverlayManager'
import { OverlayOptions } from './types'

describe('useOverlay', () => {
  describe('OverlayManager', () => {
    test('should add/remove layer to/from stack', () => {
      const a: OverlayOptions = { refs: [], onClose: jest.fn(), closeStrategy: 'pressup' }
      const b: OverlayOptions = { refs: [], onClose: jest.fn(), closeStrategy: 'pressup' }

      expect(OverlayManager.count()).toBe(0)

      OverlayManager.addOverlay(a)
      expect(OverlayManager.count()).toBe(1)

      OverlayManager.addOverlay(b)
      expect(OverlayManager.count()).toBe(2)

      OverlayManager.removeOverlay(a)
      expect(OverlayManager.count()).toBe(1)

      OverlayManager.removeOverlay(b)
      expect(OverlayManager.count()).toBe(0)
    })

    test('should call `onClose` on `Esc` press', () => {
      const onClose = jest.fn()
      const options: OverlayOptions = { refs: [], onClose, closeStrategy: 'pressup' }
      OverlayManager.addOverlay(options)

      fireEvent.keyUp(document.body, { key: 'Esc' })

      expect(onClose).toBeCalledTimes(1)
      expect(onClose.mock.calls[0][0].source).toBe('esc')
      expect(onClose.mock.calls[0][0].nativeEvent.type).toBe('keyup')
      expect(onClose.mock.calls[0][0].nativeEvent.key).toBe('Esc')

      onClose.mockReset()
      fireEvent.keyUp(document.body, { key: 'Escape' })

      expect(onClose).toBeCalledTimes(1)
      expect(onClose).toBeCalledTimes(1)
      expect(onClose.mock.calls[0][0].source).toBe('esc')
      expect(onClose.mock.calls[0][0].nativeEvent.type).toBe('keyup')
      expect(onClose.mock.calls[0][0].nativeEvent.key).toBe('Escape')

      onClose.mockReset()
      fireEvent.keyUp(document.body, { key: 'Enter' })
      expect(onClose).toBeCalledTimes(0)

      OverlayManager.removeOverlay(options)
      fireEvent.keyUp(document.body, { key: 'Esc' })
      expect(onClose).toBeCalledTimes(0)
    })

    test('should not call `onClose` on `Esc` press if layer was deleted', () => {
      const options: OverlayOptions = { refs: [], onClose: jest.fn(), closeStrategy: 'pressup' }
      OverlayManager.addOverlay(options)
      OverlayManager.removeOverlay(options)

      fireEvent.keyUp(document.body, { key: 'Esc' })
      expect(options.onClose).toBeCalledTimes(0)
    })

    test('should call `onClose` on click outside of `refs`', () => {
      const current = document.createElement('div')
      document.body.appendChild(current)

      const ref = { current }
      const onClose = jest.fn()
      const options: OverlayOptions = { refs: [ref], onClose, closeStrategy: 'pressdown' }
      OverlayManager.addOverlay(options)

      fireEvent.pointerDown(document.body)

      expect(onClose).toBeCalledTimes(1)
      expect(onClose.mock.calls[0][0].source).toBe('click')
      expect(onClose.mock.calls[0][0].nativeEvent.type).toBe('pointerdown')

      onClose.mockReset()
      options.closeStrategy = 'pressup'

      fireEvent.pointerDown(document.body)
      document.body.dispatchEvent(new Event('click'))

      expect(options.onClose).toBeCalledTimes(1)
      expect(onClose.mock.calls[0][0].source).toBe('click')
      expect(onClose.mock.calls[0][0].nativeEvent.type).toBe('click')

      document.body.removeChild(current)
      OverlayManager.removeOverlay(options)
    })

    test('should not call `onClose` after clicking on `refs`', () => {
      const current = document.createElement('div')
      document.body.appendChild(current)

      const ref = { current }
      const onClose = jest.fn()
      const options: OverlayOptions = { refs: [ref], onClose, closeStrategy: 'pressdown' }
      OverlayManager.addOverlay(options)

      fireEvent.pointerDown(current)

      expect(options.onClose).toBeCalledTimes(0)

      options.closeStrategy = 'pressup'

      fireEvent.pointerDown(current)
      fireEvent.click(current)

      expect(options.onClose).toBeCalledTimes(0)

      document.body.removeChild(current)
      OverlayManager.removeOverlay(options)
    })

    test('should not call `onClose` after `pointerdown` on `refs` and `click` outside of `refs`', () => {
      const current = document.createElement('div')
      document.body.appendChild(current)

      const ref = { current }
      const options: OverlayOptions = { refs: [ref], onClose: jest.fn(), closeStrategy: 'pressup' }
      OverlayManager.addOverlay(options)

      fireEvent.pointerDown(current)
      document.body.dispatchEvent(new Event('click'))

      expect(options.onClose).toBeCalledTimes(0)

      document.body.removeChild(current)
      OverlayManager.removeOverlay(options)
    })

    test('should call `onClose` if handler was set after the layer was added', () => {
      const options: OverlayOptions = { refs: [], closeStrategy: 'pressup' }
      const onClose = jest.fn()
      OverlayManager.addOverlay(options)

      expect(OverlayManager.count()).toBe(1)

      fireEvent.keyUp(document.body, { key: 'Esc' })
      fireEvent.pointerDown(document.body)
      document.body.dispatchEvent(new Event('click'))

      options.onClose = onClose

      fireEvent.keyUp(document.body, { key: 'Esc' })
      expect(onClose).toBeCalledTimes(1)

      onClose.mockReset()
      fireEvent.pointerDown(document.body)
      document.body.dispatchEvent(new Event('click'))
      expect(onClose).toBeCalledTimes(1)

      OverlayManager.removeOverlay(options)
    })

    test('should call `onClose` for the last layer in stack', () => {
      const onClose1 = jest.fn()
      const onClose2 = jest.fn()
      const options1: OverlayOptions = { refs: [], onClose: onClose1, closeStrategy: 'pressup' }
      const options2: OverlayOptions = { refs: [], onClose: onClose2, closeStrategy: 'pressup' }

      OverlayManager.addOverlay(options1)
      OverlayManager.addOverlay(options2)
      fireEvent.keyUp(document.body, { key: 'Esc' })

      expect(onClose1).toBeCalledTimes(0)
      expect(onClose2).toBeCalledTimes(1)

      OverlayManager.removeOverlay(options2)
      fireEvent.keyUp(document.body, { key: 'Esc' })

      expect(onClose1).toBeCalledTimes(1)
      expect(onClose2).toBeCalledTimes(1)

      OverlayManager.addOverlay(options2)
      fireEvent.keyUp(document.body, { key: 'Esc' })

      expect(onClose1).toBeCalledTimes(1)
      expect(onClose2).toBeCalledTimes(2)

      OverlayManager.removeOverlay(options1)
      OverlayManager.addOverlay(options1)
      fireEvent.keyUp(document.body, { key: 'Esc' })

      expect(onClose1).toBeCalledTimes(2)
      expect(onClose2).toBeCalledTimes(2)

      OverlayManager.removeOverlay(options1)
      OverlayManager.removeOverlay(options2)
    })
  })
})

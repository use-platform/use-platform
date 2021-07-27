import { getByTestId } from '@testing-library/react'

import { getTabbables } from '../utils/tabbable'
import { createGuard, isFocusFree, isGuard, focusFirstIn, getNextTabbableIndex } from '../utils'
import { basicFixture } from './fixtures'

describe('focus-trap', () => {
  describe('isFocusFree', () => {
    test('should return true if body is focused`', () => {
      const focusable = document.createElement('button')
      document.body.appendChild(focusable)

      focusable.focus()
      expect(isFocusFree()).toBe(false)

      focusable.blur()
      expect(isFocusFree()).toBe(true)

      document.body.removeChild(focusable)
    })
  })

  describe('isGuard', () => {
    test('should return true if element is guard', () => {
      const focusable = document.createElement('button')
      expect(isGuard(focusable)).toBe(false)

      const guard = createGuard(0)
      expect(isGuard(guard)).toBe(true)
    })
  })

  describe('focusFirstIn', () => {
    test('should set focus in first tabbable element', () => {
      const guard = createGuard(1)
      const tabbable = document.createElement('button')
      document.body.appendChild(guard)
      document.body.appendChild(tabbable)

      focusFirstIn(document.body)
      expect(tabbable).toHaveFocus()

      document.body.removeChild(guard)
      document.body.removeChild(tabbable)
    })
  })

  describe('getNextTabbableIndex', () => {
    test('should return first index if current is "-1"', () => {
      expect(getNextTabbableIndex(-1, 5, 0)).toBe(0)
    })

    test('should return fist index if current is last index (step=1)', () => {
      expect(getNextTabbableIndex(4, 5, 1)).toBe(0)
    })

    test('should return last index if current is first index (step=-1)', () => {
      expect(getNextTabbableIndex(0, 5, -1)).toBe(4)
    })

    test('should return "-1" if count=0', () => {
      expect(getNextTabbableIndex(20, 0, 1)).toBe(-1)
    })

    test('should return next relative index', () => {
      expect(getNextTabbableIndex(5, 10, 1)).toBe(6)
      expect(getNextTabbableIndex(5, 10, -1)).toBe(4)
    })
  })

  describe('getTabbables', () => {
    test('should return tabbable-elements inside container', () => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = basicFixture
      document.body.appendChild(wrapper)

      // https://github.com/jsdom/jsdom/issues/1670
      const divContentEditableTrue = getByTestId(wrapper, 'div-contenteditable-true')
      const divContentEditableFalse = getByTestId(wrapper, 'div-contenteditable-false')
      const divContentEditableNesting = getByTestId(wrapper, 'div-contenteditable-nesting')
      divContentEditableTrue.contentEditable = 'true'
      divContentEditableFalse.contentEditable = 'false'
      divContentEditableNesting.contentEditable = 'true'

      const tabbables = getTabbables(wrapper)

      expect(tabbables.map((node) => node.dataset.testid)).toMatchSnapshot()

      document.body.removeChild(wrapper)
    })

    test('should return filtered tabbable-elements', () => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = basicFixture
      document.body.appendChild(wrapper)

      const tabbables = getTabbables(wrapper, (node) => node.tagName === 'BUTTON')

      expect(tabbables.map((node) => node.dataset.testid)).toMatchSnapshot()

      document.body.removeChild(wrapper)
    })
  })
})

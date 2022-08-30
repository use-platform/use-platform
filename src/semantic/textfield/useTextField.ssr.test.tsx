/**
 * @jest-environment jsdom
 */
import { useRef } from 'react'

import { createServerRender } from '../../internal/testing'
import { useTextField } from './useTextField'

function Fixture() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { inputProps } = useTextField({}, inputRef)

  return <input {...inputProps} ref={inputRef} />
}

describe('useTextField (ssr)', () => {
  const ssr = createServerRender()

  test('should render without errors', () => {
    expect(() => ssr(<Fixture />)).not.toThrowError()
  })
})

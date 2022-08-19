import { MutableRefObject, createRef, forwardRef, useRef } from 'react'

import { createClientRender, screen } from '../../internal/testing'
import { useForwardedRef } from './useForwardedRef'

const Fixture = forwardRef<HTMLDivElement>((_, forwardedRef) => {
  const ref = useRef<HTMLDivElement>(null)
  useForwardedRef(ref, forwardedRef)

  return <div ref={ref} data-testid="container" />
})

describe('useForwardedRef', () => {
  const render = createClientRender()

  test('should copy forward ref as object to mutable ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Fixture ref={ref} />)

    expect(ref.current).toBe(screen.getByTestId('container'))
  })

  test('should copy forward ref as fn to mutable ref', () => {
    const ref = createRef<HTMLDivElement | null>() as MutableRefObject<HTMLDivElement | null>
    // eslint-disable-next-line react/jsx-no-bind
    render(<Fixture ref={(node) => (ref.current = node)} />)

    expect(ref.current).toBe(screen.getByTestId('container'))
  })
})

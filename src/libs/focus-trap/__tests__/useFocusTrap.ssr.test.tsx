/**
 * @jest-environment node
 */
import { useRef } from 'react'

//
import { createServerRender } from '../../../internal/testing/createServerRender'
import { UseFocusTrapProps, useFocusTrap } from '../useFocusTrap'

function Fixture(props: Partial<UseFocusTrapProps>) {
  const { enabled = false, ...other } = props
  const scopeRef = useRef(null)

  useFocusTrap({ ...other, enabled, scopeRef })

  return <div ref={scopeRef} />
}

describe('useFocusTrap (ssr)', () => {
  const ssr = createServerRender()

  test('should render without errors', () => {
    expect(() => ssr(<Fixture enabled />)).not.toThrowError()
  })
})

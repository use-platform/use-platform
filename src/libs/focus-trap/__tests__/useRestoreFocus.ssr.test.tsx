/**
 * @jest-environment jsdom
 */
import { createServerRender } from '../../../internal/testing'
import { UseRestoreFocusProps, useRestoreFocus } from '../useRestoreFocus'

function Fixture(props: UseRestoreFocusProps) {
  useRestoreFocus(props)

  return <div />
}

describe('useRestoreFocus (ssr)', () => {
  const ssr = createServerRender()

  test('should render without errors', () => {
    expect(() => ssr(<Fixture enabled />)).not.toThrowError()
  })
})

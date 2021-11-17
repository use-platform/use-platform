/**
 * @jest-environment node
 */
import { createServerRender } from '../../testing'
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

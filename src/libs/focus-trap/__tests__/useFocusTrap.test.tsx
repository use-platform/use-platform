import { FC, useRef } from 'react'

import { screen, createClientRender } from '../../testing'
import { useFocusTrap, UseFocusTrapProps } from '../useFocusTrap'

type FixtureProps = Partial<UseFocusTrapProps>

const Fixture: FC<FixtureProps> = (props) => {
  const { children, scopeRef, enabled = false, ...options } = props
  const innerScope = useRef<HTMLDivElement>(null)

  useFocusTrap({ ...options, enabled, scopeRef: scopeRef || innerScope })

  return (
    <div data-testid="wrapper">
      <div ref={innerScope} data-testid="container">
        {children}
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  const render = createClientRender()

  test('should create guards when focus-trap is enabled', () => {
    const { setProps } = render<FixtureProps>(<Fixture enabled={false} />)

    expect(screen.getByTestId('wrapper')).toMatchSnapshot()

    setProps({ enabled: true })
    expect(screen.getByTestId('wrapper')).toMatchSnapshot()

    setProps({ enabled: false })
    expect(screen.getByTestId('wrapper')).toMatchSnapshot()
  })

  test('should update DOM when scope-ref was changed', () => {
    const scopeRef1 = { current: null }
    const scopeRef2 = { current: null }

    const { setProps } = render<FixtureProps>(
      <Fixture enabled scopeRef={scopeRef1}>
        <div ref={scopeRef1} data-testid="container-1" />
        <div ref={scopeRef2} data-testid="container-2" />
      </Fixture>,
    )

    expect(screen.getByTestId('wrapper')).toMatchSnapshot()

    setProps({ enabled: true, scopeRef: scopeRef2 })
    expect(screen.getByTestId('wrapper')).toMatchSnapshot()

    setProps({ enabled: true, scopeRef: { current: null } })
    expect(screen.getByTestId('wrapper')).toMatchSnapshot()
  })
})

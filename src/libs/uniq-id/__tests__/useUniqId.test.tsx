import { FC } from 'react'

import { useUniqId } from '..'
import { createClientRender, renderHook, screen } from '../../../internal/testing'
import { SSRProvider } from '../../ssr'

const UnitCase: FC<{ id?: string }> = ({ id }) => <div data-testid="test" id={useUniqId(id)} />

describe('useUniqId', () => {
  const render = createClientRender()

  test('should generate stable id', () => {
    const { result, rerender } = renderHook(() => useUniqId())

    expect(result.current).toBe('xuniq-0-1')
    rerender()
    expect(result.current).toBe('xuniq-0-1')
  })

  test('should generate stable id with custom id', () => {
    const { result, rerender } = renderHook(() => useUniqId('custom-id'))

    expect(result.current).toBe('custom-id')
    rerender()
    expect(result.current).toBe('custom-id')
  })

  test('should generate stable ids with SSRProvider', () => {
    render(
      <SSRProvider>
        <UnitCase />
        <UnitCase />
      </SSRProvider>,
    )
    const nodes = screen.getAllByTestId('test')

    expect(nodes[0].id).toBe('xuniq-0-1')
    expect(nodes[1].id).toBe('xuniq-0-2')
  })

  test('should generate stable ids with SSRProvider and custom id', () => {
    const { rerender } = render(
      <SSRProvider>
        <UnitCase />
        <UnitCase id="custom-id" />
        <UnitCase />
      </SSRProvider>,
    )
    const nodes = screen.getAllByTestId('test')

    rerender(
      <SSRProvider>
        <UnitCase />
        <UnitCase />
        <UnitCase />
      </SSRProvider>,
    )

    expect(nodes[0].id).toBe('xuniq-0-1')
    expect(nodes[1].id).toBe('xuniq-0-2')
    expect(nodes[2].id).toBe('xuniq-0-3')
  })

  test('should generate stable ids with nested SSRProvider', () => {
    render(
      <SSRProvider>
        <SSRProvider>
          <UnitCase />
        </SSRProvider>
        <SSRProvider>
          <UnitCase />
        </SSRProvider>
      </SSRProvider>,
    )
    const nodes = screen.getAllByTestId('test')

    expect(nodes[0].id).toBe('xuniq-1-1')
    expect(nodes[1].id).toBe('xuniq-2-1')
  })
})

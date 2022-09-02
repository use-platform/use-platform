import React from 'react'

import { createClientRender, screen } from '../../internal/testing'
import { createSlot } from './createSlot'

describe('createSlot', () => {
  const render = createClientRender()

  test('should render empty content', () => {
    const Slot = createSlot('foo')

    render(
      <Slot>
        <div data-testid="content">content</div>
      </Slot>,
    )

    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  test('should set slot name', () => {
    const Unknown = createSlot()
    const Foo = createSlot('foo')

    expect(Unknown).toHaveProperty('__slotName', 'unknown')
    expect(Foo).toHaveProperty('__slotName', 'foo')
  })

  test('should set display name', () => {
    const Slot = createSlot('foo')

    expect(Slot).toHaveProperty('displayName', 'Slot(foo)')
  })
})

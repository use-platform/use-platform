/**
 * @jest-environment node
 */
import React, { FC } from 'react'

import { createServerRender } from '../../internal/testing/createServerRender'
import { UseOverlayOptions } from './types'
import { useOverlay } from './useOverlay'

const Overlay: FC<UseOverlayOptions> = (props) => {
  useOverlay(props)

  return null
}

describe('useOverlay (ssr)', () => {
  const ssr = createServerRender()

  test('should be rendered on server side', () => {
    const { html } = ssr(<Overlay visible essentialRefs={[]} />)

    expect(html).toBe('')
  })
})

import { Story } from '@storybook/react'
import React, { FC, PropsWithChildren } from 'react'

import { createSlot, useSlots } from '..'

const ContentSlot = createSlot('content')

const Example: FC<PropsWithChildren> = (props) => {
  const slots = useSlots(props, { defaultSlot: ContentSlot })

  return (
    <div>
      <main>{slots.children}</main>
    </div>
  )
}

export const DefaultSlot: Story = () => {
  return (
    <Example>
      <ContentSlot>
        This text will be inside the <b>slots.children</b>
      </ContentSlot>
    </Example>
  )
}

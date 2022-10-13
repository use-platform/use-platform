import { Story } from '@storybook/react'
import React, { FC } from 'react'

import { createSlot, useSlots } from '..'

interface FooterSlotProps {
  align: 'flex-start' | 'center' | 'flex-end'
}

const FooterSlot = createSlot<FooterSlotProps>('footer')

const Example: FC = (props) => {
  const slots = useSlots(props)

  const footer = slots.get(FooterSlot)

  return (
    <div>
      <main>{slots.children}</main>

      {footer && (
        <footer
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: footer.props.align,
          }}
        >
          {footer.rendered}
        </footer>
      )}
    </div>
  )
}

interface StoryArgs {
  footerAlign: FooterSlotProps['align']
}

export const SlotProps: Story<StoryArgs> = (args) => {
  return (
    <Example>
      <p>A paragraph for the main content.</p>
      <p>And another one.</p>

      <FooterSlot align={args.footerAlign}>
        <p>Here&apos;s some contact info</p>
      </FooterSlot>
    </Example>
  )
}

SlotProps.argTypes = {
  footerAlign: {
    control: {
      type: 'select',
      options: ['flex-start', 'center', 'flex-end'],
    },
    defaultValue: 'flex-start',
  },
}

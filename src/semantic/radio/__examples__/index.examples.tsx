import { Meta } from '@storybook/react'

export * from './default'

export default {
  title: 'semantic/radio',
  argTypes: {
    value: {
      options: ['foo', 'bar', 'baz'],
      control: { type: 'select' },
    },
  },
} as Meta

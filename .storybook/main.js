const path = require('path')

module.exports = {
  stories: ['../src/**/*.examples.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.resolve.alias['@use-platform/react'] = path.resolve(__dirname, '../src')
    return config
  },
}

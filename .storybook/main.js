const path = require('path')

module.exports = {
  stories: ['../src/**/*.examples.@(ts|tsx)'],
  webpackFinal: (config) => {
    config.resolve.alias['@yandex/web-platform'] = path.resolve(__dirname, '../src')
    return config
  },
}

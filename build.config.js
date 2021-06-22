/* eslint-disable react-hooks/rules-of-hooks */

const { useCleanUpPlugin } = require('@bem-react/pack/lib/plugins/CleanUpPlugin')
const { useCopyAssetsPlugin } = require('@bem-react/pack/lib/plugins/CopyAssetsPlugin')
const { useTypeScriptPlugin } = require('@bem-react/pack/lib/plugins/TypescriptPlugin')
const { usePackageJsonPlugin } = require('@bem-react/pack/lib/plugins/PackageJsonPlugin')

/**
 * @type {import('@bem-react/pack/lib/interfaces').Config}
 */
module.exports = {
  output: './dist',

  plugins: [
    useCleanUpPlugin(['./dist']),

    useTypeScriptPlugin({
      configPath: './tsconfig.prod.json',
      onCreateSideEffects: () => false,
    }),

    usePackageJsonPlugin({
      scripts: {},
    }),

    useCopyAssetsPlugin([
      {
        context: './src',
        src: './**/*.{md}',
        output: ['./dist', './dist/esm'],
      },
      {
        src: ['./readme.md'],
      },
    ]),
  ],
}

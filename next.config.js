// @ts-check
const { envs } = require('./next.preset')

const path = require('path')
const alias = require('./tsconfig.alias').alias
const MONACO_DIR = path.join(__dirname, './node_modules/monaco-editor')
const withFonts = require('next-fonts')

module.exports = withFonts({
  poweredByHeader: false,
  assetPrefix:
    process.env.NODE_ENV === 'production' ? process.env.PATH_PREFIX : '',
  env: envs,
  pageExtensions: ['page.tsx', 'api.ts'],
  strict: true,
  webpack: (config, options) => {
    for (let name in alias) {
      let dir = alias[name]
      config.resolve.alias[name] = path.join(__dirname, dir)
    }
    config.plugins = config.plugins || []

    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
    config.module.rules.push({
      test: /\.css$/,
      include: MONACO_DIR,
      use: ['style-loader', 'css-loader'],
    })
    config.plugins.push(
      new MonacoWebpackPlugin({
        publicPath: '/monaco-editor',
        filename: '../public/monaco-editor/[name].worker.[contenthash].js',
        languages: [],
      }),
    )
    return config
  },
})

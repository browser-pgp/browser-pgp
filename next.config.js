// @ts-check
const { envs } = require('./next.preset')

const path = require('path')
const alias = require('./tsconfig.alias').alias
const MONACO_DIR = path.join(__dirname, './node_modules/monaco-editor')

/**@type {any} */
let config = {
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
}

const withFonts = require('next-fonts')
config = withFonts(config)

const withOffline = require('next-offline')
/**@type {Partial<import('workbox-webpack-plugin').InjectManifestOptions>}*/
const workboxOpts = {
  manifestTransforms: [
    // @ts-ignore
    manifest => {
      manifest = manifest.map(u => {
        u.url = u.url.replace('../public/', '')
        return u
      })
      let home = {
        url: '/',
        revision: manifest.filter(u => u.url.endsWith('pages/index.js'))[0].url,
      }
      manifest = [home].concat(manifest)
      return {
        manifest: manifest,
      }
    },
  ],
}
config = withOffline({
  ...config,
  workboxOpts: workboxOpts,
})

module.exports = config

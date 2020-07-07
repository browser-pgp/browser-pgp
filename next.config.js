// @ts-check

/**@type {any} */
let config = {
  poweredByHeader: false,
  assetPrefix:
    (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_PATH_PREFIX) || '',
  pageExtensions: ['page.tsx', 'api.ts'],
  // reactStrictMode: true,
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
        revision: manifest
          .filter(u => u.url.endsWith('pages/index.js'))[0]
          .url.split('/')[3],
      }
      manifest = [home].concat(manifest)
      return {
        manifest: manifest,
      }
    },
  ],
}
// config = withOffline({
//   ...config,
//   workboxOpts: workboxOpts,
// })

module.exports = config

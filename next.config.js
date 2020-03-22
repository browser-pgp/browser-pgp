// @ts-check
const { envs } = require('./next.preset')

const path = require('path')
const alias = require('./tsconfig.alias').alias

module.exports = {
  poweredByHeader: false,
  env: envs,
  pageExtensions: ['page.tsx', 'api.ts'],
  strict: true,
  webpack: (config, options) => {
    for (let name in alias) {
      let dir = alias[name]
      config.resolve.alias[name] = path.join(__dirname, dir)
    }

    return config
  },
}

// @ts-check
require('./next.preset')

const alias = require('./tsconfig.alias').alias
/**@type {{[k:string]:string}} */
let moduleNameMapper = {}

for (let name in alias) {
  let dir = alias[name]
  moduleNameMapper[`^${name}(.*)$`] = `<rootDir>/${dir}$1`
}

module.exports = {
  setupFiles: ['<rootDir>/next.preset.js'],
  testEnvironment: 'node',
  moduleNameMapper,
}

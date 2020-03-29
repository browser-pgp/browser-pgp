// @ts-check
/// <reference path="./next-env.d.ts" />

require('dotenv').config()

const envs_keys = {
  PATH_EXT_NAME: '',
  PATH_PREFIX: '/',
}

exports.envs = Object.keys(envs_keys).reduce((t, k) => {
  t[k] = process.env[k] = process.env[k] || envs_keys[k]
  return t
}, {})

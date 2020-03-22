import { StoreName } from './constants'
import localforage from 'localforage'
import * as openpgp from 'openpgp'

export const getStoreKeys = async () => {
  const [publicKeyArmored, privateKeyArmored] = await Promise.all(
    [StoreName.PubliceKey, StoreName.PrivateKey].map(name =>
      localforage.getItem<string>(name),
    ),
  )
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(privateKeyArmored)
  const {
    keys: [publicKey],
  } = await openpgp.key.readArmored(publicKeyArmored)
  return {
    privateKey,
    publicKey,
  }
}

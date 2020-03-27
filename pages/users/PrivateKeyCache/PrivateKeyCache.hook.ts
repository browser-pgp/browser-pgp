import { PrivateKeyCacheState } from './PrivateKeyCache.state'
import { useKeyPasswordAsk } from '../KeyPasswordAsk'
import { PGPUserDocType } from '~modules/pgp-user'
import * as openpgp from 'openpgp'

export const usePrivateKeyCache = () => {
  const [cache, setCache] = PrivateKeyCacheState.useContainer()
  const keyPasswordAsk = useKeyPasswordAsk()

  async function getUserPrivateKey(
    user: Pick<PGPUserDocType, 'fingerprint' | 'privateKey'>,
  ) {
    if (!cache[user.fingerprint]) {
      let p = Promise.resolve().then(async () => {
        let key = user.privateKey
        let password = await keyPasswordAsk.open(key)
        let { keys } = await openpgp.key.readArmored(key)
        let privateKey = keys[0]
        await privateKey.decrypt(password)
        return privateKey
      })
      setCache(s => ({ ...s, [user.fingerprint]: p }))
      return p
    }
    return cache[user.fingerprint]
  }

  return {
    getUserPrivateKey,
  }
}

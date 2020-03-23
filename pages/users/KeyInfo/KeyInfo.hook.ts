import { KeyInfoState, toDisplayKeyInfo } from './KeyInfo.state'
import * as openpgp from 'openpgp'

export const useKeyInfo = () => {
  const [state, setState] = KeyInfoState.useContainer()

  const open = (pubKey: string) => {
    setState(s => ({ ...s, pubKey, open: true, pending: pubKey !== s.pubKey }))
  }
  const close = () => {
    setState(s => ({ ...s, open: false }))
  }
  const parsePubKey = async (pubKey: string) => {
    let {
      keys: [key],
      err,
    } = await openpgp.key.readArmored(pubKey)
    if (err) {
      throw err
    }
    let displayKeyInfo = await toDisplayKeyInfo(key)
    setState(s => ({ ...s, key: displayKeyInfo, pending: false }))
  }

  return {
    state,
    setState,
    open,
    close,
    parsePubKey,
  }
}

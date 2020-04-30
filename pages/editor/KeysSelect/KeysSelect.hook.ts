import { KeysSelectState, KeyType } from './KeysSelect.state'
import { PGPUserDucment } from '~modules/pgp-user'

export const useKeysSelect = () => {
  const [state, setState] = KeysSelectState.useContainer()

  const open = (keyType: KeyType, fingerprint = '') => {
    return new Promise<PGPUserDucment[]>((rl) => {
      setState((s) => ({
        ...s,
        open: true,
        keyType: keyType,
        fingerprint: '',
        cb: rl,
      }))
    })
  }

  const close = (keys: PGPUserDucment[] = []) => {
    setState((s) => ({ ...s, open: false }))
    state.cb(keys)
  }

  return {
    state,
    setState,
    open,
    close,
  }
}

import { KeyPasswordAskState } from './KeyPasswordAsk.state'
import { useStepNotification } from '~modules/utils/useStepNotification'
import * as openpgp from 'openpgp'

export const useKeyPasswordAsk = () => {
  const [state, setState] = KeyPasswordAskState.useContainer()
  const decryptKeyStepNotifications = useStepNotification('解密密钥')

  const open = (key: string) => {
    return new Promise<string>(rl => {
      setState(s => ({ ...s, open: true, key, cb: rl }))
    })
  }

  const submit = async ({ password }: { password: string }) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const {
          keys: [privateKey],
        } = await openpgp.key.readArmored(state.key)
        let pass = await privateKey.decrypt(password)
        if (!pass) {
          throw new Error('密码不正确')
        }
        close(password)
      })
      .then(...decryptKeyStepNotifications)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const close = (password: string = '') => {
    setState(s => ({ ...s, open: false }))
    state.cb(password)
  }

  return {
    state,
    setState,
    open,
    close,
    submit,
  }
}

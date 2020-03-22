import { HomeState } from './home.state'
import { useOpenPGP } from '~modules/openpgp'
import { useStepNotification } from '~modules/utils/useStepNotification'

export const useHome = () => {
  const [state, setState] = HomeState.useContainer()
  const pgp = useOpenPGP()

  const encryptStepNotice = useStepNotification('加密')
  const encrypt = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const encryptedMsg = await pgp.encrypt(msg)
        setState(s => ({ ...s, displayText: encryptedMsg }))
      })
      .then(...encryptStepNotice)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const decryptStepNotice = useStepNotification('解密')
  const decrypt = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const decryptedMsg = await pgp.decrypt(msg)
        setState(s => ({ ...s, displayText: decryptedMsg }))
      })
      .then(...decryptStepNotice)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const signStepNotice = useStepNotification('签名')
  const sign = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const signData = await pgp.sign(msg)
        setState(s => ({ ...s, displayText: signData }))
      })
      .then(...signStepNotice)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }
  const verifyStepNotice = useStepNotification('确认签名')
  const verify = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const signID = await pgp.verify(msg)
        console.log(signID)
        setState(s => ({
          ...s,
          displayText: `签名已确认. 签名者ID: ${signID}`,
        }))
      })
      .then(...verifyStepNotice)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  return {
    state,
    encrypt,
    decrypt,
    sign,
    verify,
  }
}

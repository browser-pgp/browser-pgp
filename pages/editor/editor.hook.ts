import { EditorState } from './editor.state'
import { useOpenPGP } from '~modules/openpgp'
import { useStepNotification } from '~modules/utils/useStepNotification'
import { useKeysSelect, KeyType } from './KeysSelect'
import * as openpgp from 'openpgp'
import { EditorState as EditorComponentState } from '~pages/components/Editor'
import { useKeyPasswordAsk } from './KeyPasswordAsk'

const cache: { [k: string]: openpgp.key.Key } = {}

export const useEditor = () => {
  const [state, setState] = EditorState.useContainer()
  const pgp = useOpenPGP()
  const ks = useKeysSelect()
  const [{ editor }] = EditorComponentState.useContainer()
  const keyPasswordAsk = useKeyPasswordAsk()

  const encryptStepNotice = useStepNotification('加密')
  const encrypt = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let users = await ks.open(KeyType.Public)
        console.log(users)
        if (users.length < 1) {
          throw new Error('未选择密钥')
        }
        let keys = await Promise.all(
          users.map(async u => {
            const {
              keys: [publicKey],
            } = await openpgp.key.readArmored(u.publicKey)
            return publicKey
          }),
        )
        let { data } = await openpgp.encrypt({
          message: openpgp.message.fromText(msg),
          publicKeys: keys,
        })
        editor.getModel().setValue(data)
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
        let users = await ks.open(KeyType.Private)
        if (users.length < 1) {
          throw new Error('未选择密钥')
        }
        let user = users[0]
        let privateKey: openpgp.key.Key = cache[user.fingerprint]
        if (!privateKey) {
          let key = users[0].privateKey
          let password = await keyPasswordAsk.open(key)
          let { keys } = await openpgp.key.readArmored(key)
          privateKey = keys[0]
          await privateKey.decrypt(password)
          cache[user.fingerprint] = privateKey
        }

        const { data } = await openpgp.decrypt({
          message: await openpgp.message.readArmored(msg),
          privateKeys: [privateKey],
        })
        editor.getModel().setValue(data as string)
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

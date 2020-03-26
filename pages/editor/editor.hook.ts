import { EditorState } from './editor.state'
import { useStepNotification } from '~modules/utils/useStepNotification'
import { useKeysSelect, KeyType } from './KeysSelect'
import * as openpgp from 'openpgp'
import { EditorState as EditorComponentState } from '~pages/components/Editor'
import { myDatabase } from '~libs/db'
import { PGPUserDocType } from '~modules/pgp-user'
import { usePrivateKeyCache } from '~pages/users/PrivateKeyCache'
import { useKeyInfo } from '~pages/users/KeyInfo'

const cache: { [k: string]: openpgp.key.Key } = {}

export const useEditor = () => {
  const [state, setState] = EditorState.useContainer()
  const ks = useKeysSelect()
  const [{ editor }] = EditorComponentState.useContainer()
  const { getUserPrivateKey } = usePrivateKeyCache()
  const keyInfo = useKeyInfo()

  const encryptStepNotice = useStepNotification('加密')
  const encrypt = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let users = await ks.open(KeyType.Public)
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
        let privateKey = await getUserPrivateKey(user)

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
        let users = await ks.open(KeyType.Private)
        let user = users[0]

        let privateKey = await getUserPrivateKey(user)

        const { data } = await openpgp.sign({
          message: openpgp.cleartext.fromText(msg),
          privateKeys: [privateKey],
        })
        editor.getModel().setValue(data as string)
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
        const users = await myDatabase.users.find().exec()
        const keys = await Promise.all(
          users.map(async u => {
            const {
              keys: [publicKey],
            } = await openpgp.key.readArmored(u.publicKey)
            return publicKey
          }),
        )
        let { data, signatures } = await openpgp.verify({
          message: await openpgp.cleartext.readArmored(msg),
          publicKeys: keys,
        })
        let u: PGPUserDocType
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i]
          let verifyed = signatures.some(({ keyid }) => {
            return key.getKeys(keyid).length > 0
          })
          if (verifyed) {
            u = users[i]
            break
          }
        }
        keyInfo.open(u.publicKey)
      })
      .catch(verifyStepNotice[1])
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

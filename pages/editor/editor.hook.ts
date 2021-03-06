import { EditorState } from './editor.state'
import { createElement as h } from "react";
import {
  useStepNotification,
  SilentError,
  NotistackOnlyError,
} from '~modules/utils/useStepNotification'
import { useKeysSelect, KeyType } from './KeysSelect'
import * as openpgp from 'openpgp'
import { EditorState as EditorComponentState } from '~pages/components/SimpleEditor'
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
  const encrypt = (msg: string = state.model.getValue()) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let users = await ks.open(KeyType.Public)
        if (users.length < 1) {
          throw new SilentError('未选择密钥')
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
  const decrypt = (msg: string = state.model.getValue()) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let users = await ks.open(KeyType.Private)
        if (users.length < 1) {
          throw new SilentError('未选择密钥')
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
  const sign = (msg: string = state.model.getValue(), noLock = false) => {
    if (state.pending) {
      return
    }
    const fn = async () => {
      let [user] = await ks.open(KeyType.Private)
      if (!user) {
        throw new SilentError('未选择密钥')
      }

      let privateKey = await getUserPrivateKey(user)

      const { data } = await openpgp.sign({
        message: openpgp.cleartext.fromText(msg),
        privateKeys: [privateKey],
      })
      editor.getModel().setValue(data as string)
    }
    if (noLock) {
      return fn()
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(fn)
      .catch(signStepNotice[1])
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }
  const verifyStepNotice = useStepNotification('确认签名')
  const verify = (msg: string = state.model.getValue(), noLock = false) => {
    if (state.pending) {
      return
    }
    const fn = async () => {
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
      let valid: boolean
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let sign = signatures.find(({ keyid }) => {
          return key.getKeys(keyid).length > 0
        })
        if (sign) {
          valid = sign.valid
          u = users[i]
          break
        }
      }
      let title = valid
        ? '签名公钥信息'
        : h('div',{ style:{color:'red'} },'签名有效但内容已损坏')
      keyInfo.open(u.publicKey, title)
    }
    if (noLock) {
      return fn()
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(fn)
      .catch(verifyStepNotice[1])
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const signOrVerify = (msg: string = state.model.getValue()) => {
    if (state.pending) {
      return
    }
    let stepNotice:
      | typeof signStepNotice
      | typeof verifyStepNotice = verifyStepNotice
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        try {
          // await required
          await openpgp.cleartext.fromText(msg)
          await verify(msg, true)
        } catch (err) {
          await sign(msg, true)
          stepNotice = signStepNotice
        }
      })
      .catch(err => stepNotice[1](err))
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
    signOrVerify,
  }
}

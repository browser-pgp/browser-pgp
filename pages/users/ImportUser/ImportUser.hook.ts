import {
  ImportUserState,
  EditorModel,
  ImportUserEditorViewState,
} from './ImportUser.state'
import * as openpgp from 'openpgp'
import { myDatabase } from '~libs/db'
import { useStepNotification } from '~modules/utils/useStepNotification'
import monaco from 'monaco-editor'
import { usePrivateKeyCache } from '~pages/users/PrivateKeyCache'
import { v4 as UUIDV4 } from 'uuid'
import { PGPUserDocType } from '~modules/pgp-user'
import { toUserId } from '~pages/users/KeyInfo'

export const useImportUser = () => {
  const [state, setState] = ImportUserState.useContainer()
  const [viewState, setViewState] = ImportUserEditorViewState.useContainer()
  const importUserNotification = useStepNotification('导入用户公钥')
  const checkPrivateKeyNotifications = useStepNotification('检查密钥对')
  const { getUserPrivateKey } = usePrivateKeyCache()
  const close = () => {
    setState(s => ({ ...s, open: false }))
  }
  const open = () => {
    setState(s => ({ ...s, open: true }))
  }
  const checkPrivateKey = async (
    editor?: monaco.editor.IStandaloneCodeEditor,
    _publicKey: string = getEditorValue(EditorModel.PublicKey),
    _privateKey: string = getEditorValue(EditorModel.PrivateKey),
  ) => {
    if (!_publicKey) {
      changeEditorTab(EditorModel.PublicKey, editor)
      throw new Error('缺少公钥')
    }
    if (!_privateKey) {
      changeEditorTab(EditorModel.PrivateKey, editor)
      throw new Error('缺少私钥')
    }
    const publicKey = await openpgp.key
      .readArmored(_publicKey)
      .then(({ keys, err }) => {
        if (err?.[0]) {
          changeEditorTab(EditorModel.PublicKey, editor)
          throw new Error(`公钥解析出现问题: ${err[0]?.message}`)
        }
        return keys[0]
      })
    await openpgp.key.readArmored(_privateKey).then(({ keys, err }) => {
      if (err?.[0]) {
        changeEditorTab(EditorModel.PrivateKey, editor)
        throw new Error(`私钥解析出现问题: ${err[0]?.message}`)
      }
      return keys[0]
    })
    let privateKey = await getUserPrivateKey({
      fingerprint: publicKey.getFingerprint(),
      privateKey: _privateKey,
    })
    let msg = UUIDV4()
    let { data: emsg } = await openpgp.encrypt({
      message: openpgp.message.fromText(msg),
      publicKeys: [publicKey],
    })
    let { data: dmsg } = await openpgp.decrypt({
      message: await openpgp.message.readArmored(emsg),
      privateKeys: [privateKey],
    })
    if (msg !== dmsg) {
      throw new Error('密钥对不匹配')
    }
  }
  const getEditorValue = (m: EditorModel) => {
    return state.models[m].getValue()
  }
  const importUser = async (editor?: monaco.editor.IStandaloneCodeEditor) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const publicKey = getEditorValue(EditorModel.PublicKey)
        const privateKey = getEditorValue(EditorModel.PrivateKey)
        const crt = getEditorValue(EditorModel.RevocationCertificate)
        if (!publicKey) {
          changeEditorTab(EditorModel.PublicKey, editor)
          throw new Error('缺少公钥')
        }
        if (!!privateKey) {
          await checkPrivateKey(editor, publicKey, privateKey)
        }

        let key = await openpgp.key
          .readArmored(publicKey)
          .then(({ keys, err }) => {
            if (err?.[0]) {
              changeEditorTab(EditorModel.PublicKey, editor)
              throw new Error(`公钥解析出现问题: ${err[0]?.message}`)
            }
            return keys[0]
          })
        let fingerprint = key.getFingerprint()
        let u = await myDatabase.users
          .findOne()
          .where('fingerprint')
          .eq(fingerprint)
          .exec()
        if (u) {
          throw new Error('公钥已存在')
        }

        const userid = toUserId((await key.getPrimaryUser()).user.userId)
        let user: PGPUserDocType = {
          publicKey: publicKey,
          fingerprint,
          name: userid.userid || userid.name,
          email: userid.email,
        }

        if (!!privateKey) {
          user.privateKey = privateKey
        }
        if (!!crt) {
          user.revocationCertificate = crt
        }

        await myDatabase.users.insert(user)
        setViewState({})
        close()
        setState(s => {
          for (let k in s.models) {
            let m = s.models[k]
            m.setValue('')
          }
          return s
        })
      })
      .then(...importUserNotification)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }
  const changeEditorTab = (
    v: EditorModel,
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => {
    setViewState({
      ...viewState,
      [state.focus]: editor.saveViewState(),
    })
    if (state.focus === v) {
      editor.focus()
      return
    }
    setState(s => ({
      ...s,
      focus: v,
    }))
  }
  return {
    state,
    setState,
    viewState,
    close,
    open,
    importUser,
    changeEditorTab,
    setViewState,
    checkPrivateKey: ((...r) =>
      checkPrivateKey(...r).then(
        ...checkPrivateKeyNotifications,
      )) as typeof checkPrivateKey,
  }
}

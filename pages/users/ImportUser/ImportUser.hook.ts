import {
  ImportUserState,
  EditorModel,
  ImportUserEditorViewState,
} from './ImportUser.state'
import * as openpgp from 'openpgp'
import { myDatabase } from '~libs/db'
import {
  useStepNotification,
  NotistackOnlyError,
} from '~modules/utils/useStepNotification'
import { v4 as UUIDV4 } from 'uuid'
import { PGPUserDocType } from '~modules/pgp-user'
import { toUserId } from '~pages/users/KeyInfo'
import { useKeyPasswordAsk } from '~pages/users/KeyPasswordAsk'
import { SimpleEditor } from '~pages/components/SimpleEditor'

export const useImportUser = () => {
  const [state, setState] = ImportUserState.useContainer()
  const [viewState, setViewState] = ImportUserEditorViewState.useContainer()
  const importUserNotification = useStepNotification('导入用户')
  const updateUserNotification = useStepNotification('更新用户')
  const checkPrivateKeyNotifications = useStepNotification('检查密钥对')
  const keyPasswordAsk = useKeyPasswordAsk()
  const close = () => {
    setState(s => ({ ...s, open: false }))
    setState(s=>(s.cb(),s))
  }
  const open = (id?: string) => new Promise(rl=>{
    if (!id) {
      setState(s => {
        for (let k in s.models) {
          let m = s.models[k]
          m.setValue('')
        }
        return { ...s, open: true, id: false, focus: EditorModel.PublicKey, cb: rl, }
      })
      return
    }
    setState(s => ({
      ...s,
      open: true,
      pending: true,
      id: id,
      focus: EditorModel.PublicKey,
      cb: rl,
    }))
    myDatabase.users
      .findOne()
      .where('fingerprint')
      .eq(id)
      .exec()
      .then(user => {
        state.models[EditorModel.PublicKey].setValue(user.publicKey)
        state.models[EditorModel.PrivateKey].setValue(user.privateKey || '')
        state.models[EditorModel.RevocationCertificate].setValue(
          user.revocationCertificate || '',
        )
      })
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  })
  const checkPrivateKey = async (
    editor?: SimpleEditor,
    _publicKey: string = getEditorValue(EditorModel.PublicKey),
    _privateKey: string = getEditorValue(EditorModel.PrivateKey),
    password?: string,
  ) => {
    if (!_publicKey) {
      changeEditorTab(EditorModel.PublicKey, editor)
      throw new NotistackOnlyError('缺少公钥')
    }
    if (!_privateKey) {
      changeEditorTab(EditorModel.PrivateKey, editor)
      throw new NotistackOnlyError('缺少私钥')
    }
    const publicKey = await openpgp.key
      .readArmored(_publicKey)
      .then(({ keys, err }) => {
        if (err?.[0]) {
          changeEditorTab(EditorModel.PublicKey, editor)
          throw new NotistackOnlyError(`公钥解析出现问题: ${err[0]?.message}`)
        }
        return keys[0]
      })
    const privateKey = await openpgp.key
      .readArmored(_privateKey)
      .then(({ keys, err }) => {
        if (err?.[0]) {
          changeEditorTab(EditorModel.PrivateKey, editor)
          throw new NotistackOnlyError(`私钥解析出现问题: ${err[0]?.message}`)
        }
        return keys[0]
      })
    if (!password) {
      password = await keyPasswordAsk.open(_privateKey)
    }
    if (!password) {
      throw new NotistackOnlyError('缺少密码')
    }
    await privateKey.decrypt(password)
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
      throw new NotistackOnlyError('密钥对不匹配')
    }
    return password
  }
  const getEditorValue = (m: EditorModel) => {
    return state.models[m].getValue()
  }
  const importUser = async (editor?: SimpleEditor) => {
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
          throw new NotistackOnlyError('缺少公钥')
        }
        if (!!privateKey && !state.id) {
          await checkPrivateKey(editor, publicKey, privateKey)
        }

        let key = await openpgp.key
          .readArmored(publicKey)
          .then(({ keys, err }) => {
            if (err?.[0]) {
              changeEditorTab(EditorModel.PublicKey, editor)
              throw new NotistackOnlyError(
                `公钥解析出现问题: ${err[0]?.message}`,
              )
            }
            return keys[0]
          })
        let fingerprint = key.getFingerprint()
        let u = await myDatabase.users
          .findOne()
          .where('fingerprint')
          .eq(fingerprint)
          .exec()
        // 更新用户
        if (state.id) {
          if (privateKey !== u.privateKey) {
            if (!privateKey) {
              let pass = await keyPasswordAsk.open(u.privateKey)
              if (!pass) {
                throw new NotistackOnlyError('删除私钥需要密码验证')
              }
            } else {
              await checkPrivateKey(editor, publicKey, privateKey)
            }
            await u.atomicSet('privateKey', privateKey)
          }
          if (crt !== u.revocationCertificate) {
            await u.atomicSet('revocationCertificate', crt)
          }
          close()
          return
        }
        if (u) {
          open(fingerprint)
          throw new NotistackOnlyError('公钥已存在, 打开"更新用户"')
        }

        const userid = toUserId((await key.getPrimaryUser()).user.userId)
        let user: PGPUserDocType = {
          publicKey: publicKey,
          fingerprint,
          name: userid.name,
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
      .then(...(state.id ? updateUserNotification : importUserNotification))
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const isShouldMakePublicKeyReadOnly = (v: EditorModel = state.focus) => {
    return v === EditorModel.PublicKey && !!state.id
  }
  const changeEditorTab = (v: EditorModel, editor: SimpleEditor) => {
    setViewState({
      ...viewState,
      [state.focus]: editor.saveViewState(),
    })
    editor.updateOptions({
      readOnly: isShouldMakePublicKeyReadOnly(v),
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
    isShouldMakePublicKeyReadOnly,
  }
}

import {
  ImportUserState,
  EditorModel,
  ImportUserEditorViewState,
} from './ImportUser.state'
import * as openpgp from 'openpgp'
import { myDatabase } from '~libs/db'
import { useStepNotification } from '~modules/utils/useStepNotification'
import monaco from 'monaco-editor'

export const useImportUser = () => {
  const [state, setState] = ImportUserState.useContainer()
  const [viewState, setViewState] = ImportUserEditorViewState.useContainer()
  const importUserNotification = useStepNotification('导入用户公钥')
  const close = () => {
    setState(s => ({ ...s, open: false }))
  }
  const open = () => {
    setState(s => ({ ...s, open: true }))
  }
  const importUser = async () => {
    let pubKey: string
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let {
          keys: [key],
          err,
        } = await openpgp.key.readArmored(pubKey)
        if (err) {
          throw err[0]
        }
        let fingerprint = key.getFingerprint()
        let u = await myDatabase.users
          .findOne()
          .where('fingerprint')
          .eq(fingerprint)
          .exec()
        if (u) {
          throw new Error('公钥已存在')
        }
        const userid = (await key.getPrimaryUser()).user.userId.userid
        const { name, email } = openpgp.util.parseUserId(userid)
        await myDatabase.users.insert({
          publicKey: pubKey,
          fingerprint,
          name: name,
          email: email,
        })
        close()
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
  }
}

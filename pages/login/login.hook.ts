import { LoginState, AppStatus, Params, EmptyInputFocus } from './login.state'
import { useKeysSelect, KeyType } from '~pages/editor/KeysSelect'
import { useImportUser } from '~pages/users/ImportUser'
import { usePrivateKeyCache } from '~pages/users/PrivateKeyCache'
import { myDatabase } from '~libs/db'
import { PGPUserDocType } from '~modules/pgp-user'
import * as openpgp from 'openpgp'
import {
  NotistackOnlyError,
  useStepNotification,
} from '~modules/utils/useStepNotification'

function formatName(u: PGPUserDocType) {
  return u.name + (u.email ? ` <${u.email}>` : '')
}

export const useLogin = () => {
  const [state, setState] = LoginState.useContainer()
  const ks = useKeysSelect()
  const ui = useImportUser()
  const { getUserPrivateKey } = usePrivateKeyCache()

  const tryFindApp = async () => {
    const fingerprint = state.params.fingerprint.toLowerCase()
    if (!fingerprint) {
      setState((s) => ({
        ...s,
        app: {
          ...s.app,
          status: AppStatus.Multi,
        },
      }))
      return
    }
    let users = await myDatabase.users
      .find()
      .where('fingerprint')
      .eq(fingerprint)
      .exec()

    switch (users.length) {
      case 0:
        void (function NotFound() {
          setState((s) => ({
            ...s,
            app: {
              ...s.app,
              status: AppStatus.NotFound,
            },
          }))
        })()
        return
      case 1:
        void (function Found() {
          let u = users[0]
          setState((s) => ({
            ...s,
            app: {
              status: AppStatus.Found,
              pubkey: u.publicKey,
              userId: formatName(u),
            },
          }))
        })()
        return
      default:
        void (function Multi() {
          setState((s) => ({
            ...s,
            app: {
              ...s.app,
              status: AppStatus.Multi,
            },
          }))
        })()
        return
    }
  }

  const selectUser = async () => {
    const u = await ks.open(KeyType.Private).then((users) => {
      return users[0]
    })
    if (!u) {
      return
    }
    setState((s) => ({
      ...s,
      selectedUser: {
        privkey: u.privateKey,
        userId: u.name + (u.email ? ` <${u.email}>` : ''),
        fingerprint: u.fingerprint,
      },
    }))
  }

  const pickOne = async () => {
    const u = await ks
      .open(KeyType.Public, state.params.fingerprint)
      .then((users) => users[0])
    if (!u) {
      return
    }
    setState((s) => ({
      ...s,
      app: {
        status: AppStatus.MultiPickedOne,
        pubkey: u.publicKey,
        userId: formatName(u),
      },
    }))
  }

  const importUser = async () => {
    await ui.open()
    await tryFindApp()
  }

  const updateParams = (k: keyof Params) => (v: string) => {
    setState((s) => ({
      ...s,
      params: {
        ...s.params,
        [k]: v,
      },
    }))
  }

  const setLoginContent = async () => {
    if (!state.selectedUser) {
      setState((s) => ({ ...s, focus: EmptyInputFocus.User }))
      throw new NotistackOnlyError('未选择登录帐号')
    }
    if (!state.app.pubkey) {
      setState((s) => ({ ...s, focus: EmptyInputFocus.App }))
      throw new NotistackOnlyError('未选择应用')
    }
    if (!state.params.auth) {
      setState((s) => ({ ...s, focus: EmptyInputFocus.Auth }))
      throw new NotistackOnlyError('登录地址不能为空')
    }
    const u = state.selectedUser
    async function signData(data: {
      mid: string
      fingerprint: string
      auth: string
    }) {
      const privateKey = await getUserPrivateKey({
        privateKey: state.selectedUser.privkey,
      })
      const msg = await openpgp.cleartext.fromText(JSON.stringify(data))
      const signResult = await openpgp.sign({
        message: msg,
        privateKeys: [privateKey],
      })
      return signResult.data
    }
    async function encryptData(data: string) {
      const {
        err,
        keys: [pubkey],
      } = await openpgp.key.readArmored(state.app.pubkey)
      if (err?.length) {
        throw err[0]
      }
      let msg = await openpgp.message.fromText(data)
      let encryptResult = await openpgp.encrypt({
        message: msg,
        publicKeys: [pubkey],
      })
      return encryptResult.data
    }
    let data = {
      mid: state.params.mid,
      auth: state.params.auth,
      fingerprint: u.fingerprint,
    }
    let t = await signData(data)
    t = await encryptData(t)
    setState((s) => ({ ...s, content: t }))
    // 等待下次状态更新完成
    await new Promise((rl) => setState((s) => (rl(), s)))
  }

  const authStepNotifiactions = useStepNotification('认证签名并加密')
  const postForm = (form: HTMLFormElement) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState((s) => ({ ...s, pending: true })))
      .then(async () => {
        await setLoginContent()
        form.submit()
      })
      .then(...authStepNotifiactions)
      .finally(() => {
        setState((s) => ({ ...s, pending: false }))
      })
  }

  return {
    state,
    setState,
    tryFindApp,
    selectUser,
    importUser,
    pickOne,
    updateParams,
    postForm,
  }
}

import { LoginState, AppStatus, Params } from './login.state'
import { useKeysSelect, KeyType } from '~pages/editor/KeysSelect'
import { useImportUser } from '~pages/users/ImportUser'
import { myDatabase } from '~libs/db'
import { PGPUserDocType } from '~modules/pgp-user'

function formatName(u: PGPUserDocType) {
  return u.name + (u.email ? ` <${u.email}>` : '')
}

export const useLogin = () => {
  const [state, setState] = LoginState.useContainer()
  const ks = useKeysSelect()
  const ui = useImportUser()
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
  return {
    state,
    setState,
    tryFindApp,
    selectUser,
    importUser,
    pickOne,
    updateParams,
  }
}

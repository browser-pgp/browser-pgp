import { SyncState, store, SyncStatus } from './sync.state'
import { FormData } from './sync.state'
import {
  useStepNotification,
  NotistackOnlyError,
  StepError,
} from '~modules/utils/useStepNotification'
import { useSnackbar } from 'notistack'
import { myDatabase } from '~libs/db'

import RxDB from 'rxdb'
RxDB.plugin(require('pouchdb-adapter-http'))

export const useSync = () => {
  const [state, setState] = SyncState.useContainer()
  const { enqueueSnackbar } = useSnackbar()

  const setRememberPassword = (checked: boolean) => {
    setState(s => ({ ...s, rememberPassword: checked }))
    store.rememberPassword = checked
  }

  const saveConfig = (data: FormData, silent = false) => {
    let password = ''
    if (state.rememberPassword) {
      password = data.password
    }
    store.savedConfig = {
      ...data,
      password,
    }
    if (!silent) {
      enqueueSnackbar('保存远程同步设置成功')
    }
  }

  const WrapperAsyncFn = (
    notifications: [() => any, (e: any) => any],
    fn: (d: FormData) => any,
  ) => {
    return async (d: FormData) => {
      if (state.pending) {
        return
      }
      return Promise.resolve(setState(s => ({ ...s, pending: true })))
        .then(() => fn(d))
        .then(...notifications)
        .finally(() => {
          setState(s => ({ ...s, pending: false }))
        })
    }
  }

  const getRemoteUrl = (d: FormData) => {
    return Promise.resolve()
      .then(() => {
        let u = new URL(d.remote)
        u.username = d.username
        u.password = d.password
        return u.toString()
      })
      .catch(() => {
        throw new NotistackOnlyError('链接格式不对')
      })
  }

  const checkConfig = async (data: FormData) => {
    return Promise.resolve()
      .then(async () => {
        saveConfig(data, true)
        setState(s => ({ ...s, status: SyncStatus.CheckConfig }))
        var str = data.username + ':' + data.password
        var token = btoa(unescape(encodeURIComponent(str)))
        let r = await fetch(data.remote, {
          credentials: 'include',
          headers: {
            Authorization: 'Basic ' + token,
          },
        }).catch(e => {
          throw new NotistackOnlyError('远程地址连接失败')
        })
        if (r.status === 401) {
          throw new NotistackOnlyError('认证失败')
        }
        let t: { db_name?: string; reason?: string } = await r
          .json()
          .catch(() => {
            throw new NotistackOnlyError('不兼容的远程地址')
          })
        if (r.status !== 200) {
          throw new NotistackOnlyError(
            t.reason || `状态码预期: 200, 实际: ${r.status}`,
          )
        }
        if (typeof t.db_name !== 'string') {
          throw new NotistackOnlyError('找不到数据库')
        }
        setState(s => ({ ...s, status: SyncStatus.Ready }))
      })
      .catch(e => {
        setState(s => ({ ...s, status: SyncStatus.WrongConfig }))
        throw e
      })
  }

  const startSync = async (data: FormData) => {
    await checkConfig(data)
    let remote = await getRemoteUrl(data)
    setState(s => ({ ...s, status: SyncStatus.Pending }))
    setState(s => ({ ...s, sync: null }))
    let sync = myDatabase.users.sync({
      remote: remote,
      waitForLeadership: false,
      options: {
        live: false,
      },
    })
    setState(s => ({ ...s, sync: sync }))
    await new Promise((rl, rj) => {
      let c = 0
      sync.complete$.subscribe(() => {
        c++
        if (c !== 2) {
          return
        }
        rl()
      })
      sync.error$.subscribe(e => rj(e))
    })
    setState(s => ({ ...s, status: SyncStatus.Ready }))
  }

  const stopSync = async () => {
    await state.sync.cancel()
    setState(s => ({ ...s, status: SyncStatus.Ready }))
  }

  return {
    state,
    setState,
    setRememberPassword,
    saveConfig,
    checkConfig: WrapperAsyncFn(
      useStepNotification('检查远程地址连接'),
      checkConfig,
    ),
    startSync: WrapperAsyncFn(useStepNotification('远程同步'), startSync),
    stopSync: stopSync,
  }
}

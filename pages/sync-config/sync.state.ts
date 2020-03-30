import { useState, useMemo } from 'react'
import { createContainer } from 'unstated-next'
import { RxReplicationState } from 'rxdb'

export type FormData = {
  remote: string
  username: string
  password: string
}

export enum SyncStatus {
  NoConfig,
  Ready,
  Error,
  Pending,
  Finished,
  CheckConfig,
  NoPassword,
  WrongConfig,
}

export const store = {
  get rememberPassword() {
    let r = localStorage.getItem('rememberSyncPassword')
    return r === '1'
  },
  set rememberPassword(value: boolean) {
    localStorage.setItem('rememberSyncPassword', value ? '1' : '0')
  },
  get savedConfig(): FormData {
    let d = localStorage.getItem('syncConfig') || '{}'
    return JSON.parse(d)
  },
  set savedConfig(data: FormData) {
    localStorage.setItem('syncConfig', JSON.stringify(data))
  },
}

const useSyncState = () => {
  const { rememberPassword, savedConfig, status } = useMemo(() => {
    let { rememberPassword, savedConfig } = store
    let status = SyncStatus.NoConfig
    if (!!savedConfig.remote) {
      status = SyncStatus.Ready
    }
    if (!savedConfig.password) {
      status = SyncStatus.NoPassword
    }
    return { rememberPassword, savedConfig, status: status as SyncStatus }
  }, [])
  return useState({
    status: status,
    pending: false,
    rememberPassword: rememberPassword,
    savedConfig: savedConfig,
    sync: null as RxReplicationState,
  })
}

export const SyncState = createContainer(useSyncState)

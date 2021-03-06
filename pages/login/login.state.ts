import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'

export enum AppStatus {
  // 尝试根据指纹匹配, 但没有任何匹配的
  NotFound,
  // 已根据指纹自动找到
  Found,
  // 多个指纹匹配
  Multi,
  // 有多个但选择了一个
  MultiPickedOne,
}

interface AppInfo {
  pubkey: any
  userId: string
  status: AppStatus
}

interface SelectUser {
  privkey: any
  userId: string
  fingerprint: string
}

export interface Params {
  mid: string
  auth: string
  fingerprint: string
}

export enum EmptyInputFocus {
  None,
  App,
  User,
  Auth,
}

const defualtParams: Params = {
  mid: '',
  auth: '',
  fingerprint: '',
}

export enum DisplayMode {
  Auto,
  Input,
}

const useLoginState = (params: Params) => {
  params = {
    ...defualtParams,
    ...params,
  }
  return useState({
    app: null as null | AppInfo,
    selectedUser: null as null | SelectUser,
    content: '',
    pending: false,
    params: params,
    focus: EmptyInputFocus.None,
    mode: DisplayMode.Auto,
  })
}

import { createContainer } from 'unstated-next'
export const LoginState = createContainer(useLoginState)

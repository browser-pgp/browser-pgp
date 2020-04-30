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
}

export interface Params {
  mid: string
  auth: string
  fingerprint: string
}

const defualtParams: Params = {
  mid: '',
  auth: '',
  fingerprint: '',
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
    params: params,
  })
}

import { createContainer } from 'unstated-next'
export const LoginState = createContainer(useLoginState)

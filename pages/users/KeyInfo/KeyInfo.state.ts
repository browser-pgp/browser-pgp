import { useState } from 'react'
import * as openpgp from 'openpgp'
import { createContainer } from 'unstated-next'

const useKeyInfoState = () => {
  return useState({
    open: false,
    pubKey: '',
    pending: true,
    key: null as DisplayKeyInfo,
    err: '',
  })
}

export const KeyInfoState = createContainer(useKeyInfoState)

export type UserId = {
  userid: string
  email: string
  name: string
  comment: string
}
export function toUserId(_userId: openpgp.packet.Userid): UserId {
  let userId: UserId = _userId as any
  userId.name = userId.name || userId.userid
  return userId as any
}

export type DisplayKeyInfo = {
  userId: UserId
  keyId: string
  createAt: string
  expireAt: string
  fingerprint: string
}
export const toDisplayKeyInfo = async (
  key: openpgp.key.Key,
): Promise<DisplayKeyInfo> => {
  // @ts-ignore
  let keyId = key.getKeyId().toHex()
  // @ts-ignore
  let primaryUser = await key.getPrimaryUser()
  let expireAt = await key.getExpirationTime()
  let createAt = key.getCreationTime().toISOString()
  return {
    keyId,
    userId: toUserId(primaryUser.user.userId),
    createAt,
    expireAt,
    fingerprint: key.primaryKey.getFingerprint(),
  }
}

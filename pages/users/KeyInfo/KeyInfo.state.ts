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

export type DisplayKeyInfo = {
  userId: string
  keyId: string
  comment: string
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
  let userId = (await key.getPrimaryUser()).user.userId.userid
  let expireAt = await key.getExpirationTime()
  let comment = ''
  let createAt = key.getCreationTime().toISOString()
  return {
    keyId,
    userId,
    comment,
    createAt,
    expireAt,
    fingerprint: key.primaryKey.getFingerprint()
  }
}

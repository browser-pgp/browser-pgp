import { useState } from 'react'
import { createContainer } from 'unstated-next'
import { PGPUserDucment } from '~modules/pgp-user'

export enum KeyType {
  Public,
  Private,
}

const useKeysSelectState = () => {
  return useState({
    open: false,
    keyType: KeyType.Public,
    fingerprint: '',
    cb: (keys: PGPUserDucment[]): any => 0,
  })
}

export const KeysSelectState = createContainer(useKeysSelectState)

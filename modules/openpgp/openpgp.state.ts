import { useState } from 'react'
import * as openpgp from 'openpgp'

export const useOpenPGPState = () => {
  return useState({
    publicKey: null as openpgp.key.Key,
    privateKey: null as openpgp.key.Key,
  })
}

import { createContainer } from 'unstated-next'

export const OpenPGPState = createContainer(useOpenPGPState)

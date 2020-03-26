import { useState } from 'react'
import * as openpgp from 'openpgp'

const usePrivateKeyCacheState = () => {
  return useState<{ [k: string]: Promise<openpgp.key.Key> }>({})
}

import { createContainer } from 'unstated-next'
export const PrivateKeyCacheState = createContainer(usePrivateKeyCacheState)

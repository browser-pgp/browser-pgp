import { useState } from 'react'

const useUserKeyCheckState = () => {
  return useState({
    open: true,
    pending: false,
    hasPubKey: null as null | boolean,
  })
}

import { createContainer } from 'unstated-next'

export const UserKeyCheckState = createContainer(useUserKeyCheckState)

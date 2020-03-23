import { useState } from 'react'

const useAddUserState = () => {
  return useState({
    open: false,
    pending: false,
  })
}

import { createContainer } from 'unstated-next'

export const AddUserState = createContainer(useAddUserState)

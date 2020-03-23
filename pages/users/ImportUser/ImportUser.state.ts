import { useState } from 'react'

const useImportUserState = () => {
  return useState({
    open: false,
    pending: false,
  })
}

import { createContainer } from 'unstated-next'
export const ImportUserState = createContainer(useImportUserState)

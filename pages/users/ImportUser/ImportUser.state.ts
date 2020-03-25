import { useState } from 'react'

const useImportUserState = () => {
  return useState({
    open: true,
    pending: false,
  })
}

import { createContainer } from 'unstated-next'
export const ImportUserState = createContainer(useImportUserState)

import { useState } from 'react'
import { createContainer } from 'unstated-next'
import * as openpgp from 'openpgp'

const useKeyPasswordAskState = () => {
  return useState({
    pending: false,
    open: false,
    key: '',
    cb: (password: string): any => 0,
  })
}

export const KeyPasswordAskState = createContainer(useKeyPasswordAskState)

import { useState } from 'react'
import { createContainer } from 'unstated-next'
const useDelUserState = () => {
  return useState({
    open: false,
    pending: false,
    id: '',
    cb: (() => 0) as (deleted: boolean) => any,
  })
}
export const DelUserState = createContainer(useDelUserState)

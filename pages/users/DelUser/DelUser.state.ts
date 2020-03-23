import { useState } from 'react'
import { createContainer } from 'unstated-next'
const useDelUserState = () => {
  return useState({
    open: false,
    pending: false,
    id: '',
  })
}
export const DelUserState = createContainer(useDelUserState)

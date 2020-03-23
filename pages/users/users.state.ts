import { useState } from 'react'

const useUsersState = () => {
  return useState({})
}

import { createContainer } from 'unstated-next'

export const UsersState = createContainer(useUsersState)

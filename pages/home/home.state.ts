import { useState } from 'react'

const useHomeState = () => {
  return useState({
    pending: false,
    displayText: '',
  })
}

import { createContainer } from 'unstated-next'

export const HomeState = createContainer(useHomeState)

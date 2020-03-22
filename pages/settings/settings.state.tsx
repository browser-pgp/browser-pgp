import { useState } from 'react'

const useSettingsState = () => {
  return useState()
}

import { createContainer } from 'unstated-next'

export const SettingsState = createContainer(useSettingsState)

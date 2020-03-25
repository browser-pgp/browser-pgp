import { useState } from 'react'

const useEditorState = () => {
  return useState({
    pending: false,
  })
}

import { createContainer } from 'unstated-next'

export const EditorState = createContainer(useEditorState)

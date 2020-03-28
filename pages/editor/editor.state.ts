import { useState, useMemo } from 'react'
import monaco from '~pages/components/Editor/MonacoEditor'

const useEditorState = () => {
  const model = useMemo(() => {
    return monaco.editor.createModel('')
  }, [])
  return useState({
    pending: false,
    model: model,
  })
}

import { createContainer } from 'unstated-next'

export const EditorState = createContainer(useEditorState)

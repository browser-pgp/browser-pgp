import { useState, useMemo } from 'react'
import { SimpleEditor} from '~pages/components/SimpleEditor'

const useEditorState = () => {
  const model = useMemo(() => {
    return SimpleEditor.createModel('')
  }, [])
  return useState({
    pending: false,
    model: model,
  })
}

import { createContainer } from 'unstated-next'

export const EditorState = createContainer(useEditorState)

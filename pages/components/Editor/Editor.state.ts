import { useState } from 'react'
import * as monaco from 'monaco-editor'

const useEditorState = () => {
  return useState({
    editor: null as monaco.editor.IStandaloneCodeEditor,
  })
}

import { createContainer } from 'unstated-next'
export const EditorState = createContainer(useEditorState)

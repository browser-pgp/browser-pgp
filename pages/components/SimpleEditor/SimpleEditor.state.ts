import { useState } from 'react'
import { SimpleEditor } from "./SimpleEditor.class";

const useEditorState = () => {
  return useState({
    editor: null as SimpleEditor,
  })
}

import { createContainer } from 'unstated-next'
export const EditorState = createContainer(useEditorState)

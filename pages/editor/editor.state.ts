import { useState, useMemo } from 'react'
import { SimpleEditor} from '~pages/components/SimpleEditor'

const tmpEditorContentKey = "tmp-editor-content-store"
export const tmpEditor = {
  get content(){
    return sessionStorage.getItem(tmpEditorContentKey) || ''
  },
  set content(value){
    sessionStorage.setItem(tmpEditorContentKey,value)
  },
}

const useEditorState = () => {
  const model = useMemo(() => {
    let model = SimpleEditor.createModel(tmpEditor.content)
    model.onDidChangeContent(()=>{
      tmpEditor.content = model.getValue()
    })
    return model
  }, [])
  return useState({
    pending: false,
    model: model,
  })
}

import { createContainer } from 'unstated-next'

export const EditorState = createContainer(useEditorState)

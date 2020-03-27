import { useState, useMemo } from 'react'
import monaco from '~pages/components/Editor/MonacoEditor'

export enum EditorModel {
  PublicKey = 'PublicKey',
  PrivateKey = 'PrivateKey',
  RevocationCertificate = 'RevocationCertificate',
}

const useImportUserState = () => {
  let models = useMemo(() => {
    let models: { [k: string]: monaco.editor.ITextModel } = {}
    for (let key in EditorModel) {
      models[key] = monaco.editor.createModel('')
    }
    return models
  }, [])
  return useState({
    open: false,
    pending: false,
    models: models,
    focus: EditorModel.PublicKey,
    id: false as false | string,
  })
}

const useImportUserEditorViewState = () => {
  return useState<{ [k: string]: monaco.editor.ICodeEditorViewState }>({})
}

import { createContainer } from 'unstated-next'
export const ImportUserState = createContainer(useImportUserState)
export const ImportUserEditorViewState = createContainer(
  useImportUserEditorViewState,
)

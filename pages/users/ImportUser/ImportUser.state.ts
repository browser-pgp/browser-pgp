import { useState, useMemo } from 'react'
import {
  SimpleEditor,
  SimpleTextModel,
  ICodeEditorViewState,
} from '~pages/components/SimpleEditor'

export enum EditorModel {
  PublicKey = 'PublicKey',
  PrivateKey = 'PrivateKey',
  RevocationCertificate = 'RevocationCertificate',
}

const useImportUserState = () => {
  let models = useMemo(() => {
    let models: { [k: string]: SimpleTextModel } = {}
    for (let key in EditorModel) {
      models[key] = SimpleEditor.createModel('')
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
  return useState<{ [k: string]: ICodeEditorViewState }>({})
}

import { createContainer } from 'unstated-next'
export const ImportUserState = createContainer(useImportUserState)
export const ImportUserEditorViewState = createContainer(
  useImportUserEditorViewState,
)

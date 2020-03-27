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
      let u = `pgp-user-import:/${key}`
      models[key] = monaco.editor.createModel(
        '',
        undefined,
        monaco.Uri.parse(u),
      )
    }
    return models
  }, [])
  return useState({
    open: false,
    pending: false,
    models: models,
    focus: EditorModel.PublicKey,
  })
}

const useImportUserEditorViewState = () => {
  return useState({})
}

import { createContainer } from 'unstated-next'
export const ImportUserState = createContainer(useImportUserState)
export const ImportUserEditorViewState = createContainer(
  useImportUserEditorViewState,
)

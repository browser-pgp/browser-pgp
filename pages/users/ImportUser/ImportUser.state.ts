import { useState } from 'react'
import monaco from 'monaco-editor'

export enum Models {
  PublicKey,
  PrivateKey,
  RevocationCertificate,
}

const useImportUserState = () => {
  return useState({
    open: true,
    pending: false,
    models: {} as { [k: Models]: monaco.editor.ITextModel },
  })
}

import { createContainer } from 'unstated-next'
export const ImportUserState = createContainer(useImportUserState)

import { useOpenPGP } from '~modules/openpgp'
import { useState } from 'react'
import { useHome } from './home.hook'
import { useSnackbar } from 'notistack'
import { MainLayout } from '~pages/layouts'
import dynamic from 'next/dynamic'
import { Editor } from '~pages/components/Editor'

export const EditorPage = () => {
  return (
    <MainLayout>
      <div style={{ height: '80vh' }}>
        <Editor />
      </div>
    </MainLayout>
  )
}

import { HomeState } from './home.state'
import { EditorState } from '~pages/components/Editor'
export default () => {
  return (
    <HomeState.Provider>
      <EditorState.Provider>
        <EditorPage />
      </EditorState.Provider>
    </HomeState.Provider>
  )
}

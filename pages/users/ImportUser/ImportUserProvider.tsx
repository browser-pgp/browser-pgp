import { StatelessComponent } from 'react'
import { ImportUserDialog } from './ImportUserDialog'
import { ImportUserState } from './ImportUser.state'
import { ImportUserEditorViewState } from './ImportUser.state'

export const ImportUserProvider: StatelessComponent = props => {
  return (
    <ImportUserState.Provider>
      <ImportUserEditorViewState.Provider>
        <ImportUserDialog />
        {props.children}
      </ImportUserEditorViewState.Provider>
    </ImportUserState.Provider>
  )
}

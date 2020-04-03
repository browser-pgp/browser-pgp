import { useImportUser } from './ImportUser.hook'

import { Dialog } from '@material-ui/core'
import { ImportUserForm } from './ImportUserForm'
import { EditorState } from '~pages/components/SimpleEditor'

export const ImportUserDialog = () => {
  const { state, close } = useImportUser()
  return (
    <Dialog
      open={state.open}
      onClose={state.pending ? () => 0 : close}
      fullWidth
      maxWidth="sm"
    >
        <EditorState.Provider>
          <ImportUserForm />
        </EditorState.Provider>
    </Dialog>
  )
}

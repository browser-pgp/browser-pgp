import { Dialog } from '@material-ui/core'
import { useAddUser } from './AddUser.hook'
import { AddUserForm } from './AddUserForm'

export const AddUserDialog = () => {
  const { state, close } = useAddUser()
  return (
    <Dialog
      open={state.open}
      maxWidth="sm"
      fullWidth
      onClose={state.pending ? () => 0 : close}
    >
      <AddUserForm />
    </Dialog>
  )
}

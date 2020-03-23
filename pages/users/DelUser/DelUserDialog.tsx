import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core'
import { useDelUser } from './DelUser.hook'

export const DelUserDialog = () => {
  const { state, close } = useDelUser()
  return (
    <Dialog open={state.open} onClose={state.pending ? () => 0 : close}>
      <DialogTitle>删除确认 ?</DialogTitle>
      <DialogContent>
        确认是否删除 {state.id}, 删除后将无法找回
      </DialogContent>
      <DialogActions>
        <Button disabled={state.pending} onClick={close}>
          取消
        </Button>
        <Button disabled={state.pending} color="primary">
          删除
        </Button>
      </DialogActions>
    </Dialog>
  )
}

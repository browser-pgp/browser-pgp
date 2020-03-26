import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { useKeyPasswordAsk } from './KeyPasswordAsk.hook'

export const KeyPasswordAskDialog = () => {
  const { handleSubmit, register } = useForm()
  const { state, close, submit } = useKeyPasswordAsk()
  return (
    <Dialog
      open={state.open}
      onClose={state.pending ? () => 0 : () => close()}
      fullWidth
      maxWidth="xs"
    >
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>解密密钥</DialogTitle>
        <DialogContent style={{ overflow: 'hidden' }}>
          <TextField
            disabled={state.pending}
            variant="outlined"
            name="password"
            inputRef={register}
            fullWidth
            required
            type="password"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close()} disabled={state.pending}>
            取消
          </Button>
          <Button type="submit" disabled={state.pending} color="primary">
            提交
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

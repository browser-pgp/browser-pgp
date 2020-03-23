import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core'
import { useImportUser } from './ImportUser.hook'
import { useForm } from 'react-hook-form'
import { useKeyInfo } from '../KeyInfo'
export const ImportUserForm = () => {
  const { register, handleSubmit, watch } = useForm()
  const keyInfo = useKeyInfo()
  const pubKey = watch('pub-key')
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <DialogTitle>导入公钥</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          rows={18}
          rowsMax={18}
          label="公钥"
          variant="outlined"
          fullWidth
          required
          name="pub-key"
          inputRef={register}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            keyInfo.open(pubKey)
          }}
        >
          查看
        </Button>
        <Button type="submit" color="primary">
          导入
        </Button>
      </DialogActions>
    </form>
  )
}

import { Fragment, useState } from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { useStepNotification } from '~modules/utils/useStepNotification'
import { useUserKeyCheck } from './UserKeyCheck.hook'

export const UserKeyDecrypt = () => {
  const { register, handleSubmit } = useForm()
  const [err, setErr] = useState('')
  const [pending, setPending] = useState<boolean>(false)
  const decryptKeyStepNotifications = useStepNotification('解密密钥')
  const { decryptPrivateKey, close } = useUserKeyCheck()

  const decryptKey = ({ pass }: { pass: string }) => {
    if (pending) {
      return
    }
    return Promise.resolve(setPending(true))
      .then(async () => {
        await decryptPrivateKey(pass)
        close()
      })
      .catch(e => {
        setErr(e?.message)
        throw e
      })
      .then(...decryptKeyStepNotifications)
      .finally(() => {
        setPending(false)
      })
  }
  return (
    <form onSubmit={handleSubmit(decryptKey)}>
      <DialogTitle>解密密钥</DialogTitle>
      <DialogContent>
        <TextField
          disabled={pending}
          type="password"
          fullWidth
          variant="outlined"
          required
          label="密钥"
          name="pass"
          inputRef={register}
          error={!!err}
          helperText={err}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} type="submit" color="primary">
          解密
        </Button>
      </DialogActions>
    </form>
  )
}

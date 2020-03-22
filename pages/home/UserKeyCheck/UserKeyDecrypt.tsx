import { Fragment, useState } from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { useStepNotification } from '~modules/utils/useStepNotification'
import { useUserKeyCheck } from './UserKeyCheck.hook'
import { SessionStoreName } from './constants'

type FormData = {
  password: string
  remember: boolean
}

export const UserKeyDecrypt = () => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      remember: false,
    },
  })
  const [err, setErr] = useState('')
  const [pending, setPending] = useState<boolean>(false)
  const decryptKeyStepNotifications = useStepNotification('解密密钥')
  const { decryptPrivateKey, close } = useUserKeyCheck()

  const decryptKey = ({ password: pass, remember }: FormData) => {
    if (pending) {
      return
    }
    return Promise.resolve(setPending(true))
      .then(async () => {
        await decryptPrivateKey(pass)
        if (remember) {
          sessionStorage.setItem(SessionStoreName.PasswordKey, pass)
        }
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
          name="password"
          inputRef={register}
          error={!!err}
          helperText={err}
        />
        <FormControlLabel
          control={
            <Checkbox name="remember" inputRef={register} color="primary" />
          }
          label="本次会话中记住密码"
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

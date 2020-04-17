import {
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  useTheme,
  FormControl,
  InputLabel,
} from '@material-ui/core'
import { useAddUser, FormData, CurveOptions } from './AddUser.hook'
import { useForm, Controller } from 'react-hook-form'

export const AddUserForm = () => {
  const { state, genUserKey, close } = useAddUser()
  const theme = useTheme()
  const { register, handleSubmit, control, watch, errors } = useForm<
    FormData & { pass2: string }
  >({
    defaultValues: {
      curve: CurveOptions[0].value,
      email: '',
      name: '',
      pass: '',
      pass2: '',
    },
  })
  let pass = watch('pass')
  let confirmPassError = !!errors.pass2
  return (
    <form onSubmit={handleSubmit(genUserKey)}>
      <DialogTitle>添加用户</DialogTitle>
      <DialogContent
        style={{
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        }}
      >
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              variant="outlined"
              disabled={state.pending}
              fullWidth
              inputRef={register}
              name="name"
              label="称呼"
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              disabled={state.pending}
              fullWidth
              inputRef={register}
              type="email"
              name="email"
              label="邮箱"
            />
          </Grid>
          <Grid item>
            <FormControl
              fullWidth
              variant="outlined"
              required
              disabled={state.pending}
            >
              <InputLabel id="curve-options">加密选项</InputLabel>
              <Controller
                as={
                  <Select required labelId="curve-options">
                    {CurveOptions.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name="curve"
                control={control}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              disabled={state.pending}
              fullWidth
              inputRef={register}
              required
              type="password"
              label="解密密码"
              name="pass"
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              disabled={state.pending}
              fullWidth
              inputRef={register({
                validate: (value) => (!value ? true : pass === value),
              })}
              required
              type="password"
              label="解密密码(二次确认)"
              name="pass2"
              error={confirmPassError}
              helperText={confirmPassError ? '两次密码不一致' : ''}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={state.pending} onClick={close}>
          取消
        </Button>
        <Button disabled={state.pending} color="primary" type="submit">
          生成新的密钥
        </Button>
      </DialogActions>
    </form>
  )
}

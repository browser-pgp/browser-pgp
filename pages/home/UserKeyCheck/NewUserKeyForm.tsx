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
import { useUserKeyCheck, FormData, CurveOptions } from './UserKeyCheck.hook'
import { useForm, Controller } from 'react-hook-form'

export const NewUserKeyForm = () => {
  const { state, genUserKey } = useUserKeyCheck()
  const theme = useTheme()
  const { register, handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      curve: CurveOptions[0].value,
      email: 'a@a.com',
      name: 'ssss',
      pass: '123',
    },
  })
  return (
    <form onSubmit={handleSubmit(genUserKey)}>
      <DialogTitle>创建初始公钥</DialogTitle>
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
                    {CurveOptions.map(item => (
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" type="submit">
          生成
        </Button>
      </DialogActions>
    </form>
  )
}

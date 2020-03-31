import {
  Grid,
  TextField,
  ButtonGroup,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { FormData } from './sync.state'
import { useSync } from './sync.hook'

enum FormAction {
  SaveConfig = '/sync/save-config',
  CheckConfig = '/sync/check-config',
  StartSync = '/sync/start-sync',
}

export const SyncForm = () => {
  const {
    state,
    checkConfig,
    saveConfig,
    startSync,
    setRememberPassword,
  } = useSync()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: state.savedConfig as any,
  })
  return (
    <form
      style={{ width: '100%' }}
      action={FormAction.CheckConfig}
      onSubmit={handleSubmit(d => {
        let action = document.activeElement.getAttribute('formAction')
        switch (action as FormAction) {
          case FormAction.SaveConfig:
            return saveConfig(d)
          case FormAction.CheckConfig:
            return checkConfig(d)
          case FormAction.StartSync:
            return startSync(d)
        }
      })}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <TextField
            variant="outlined"
            label="远程地址"
            placeholder="https://example.com"
            type="url"
            helperText="记得把当前站点加到 cors 名单中, 否则会出现跨域问题无法同步"
            multiline
            rowsMax={3}
            fullWidth
            required
            disabled={state.pending}
            name="remote"
            inputRef={register}
          />
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label="帐号"
            fullWidth
            required
            disabled={state.pending}
            name="username"
            inputRef={register}
          />
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label="密码"
            type="password"
            fullWidth
            required={state.rememberPassword}
            disabled={state.pending}
            name="password"
            inputRef={register}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={state.rememberPassword}
                  disabled={state.pending}
                  onChange={(e, checked) => setRememberPassword(checked)}
                />
              }
              label="记住密码"
            />
          </FormGroup>
        </Grid>
        <Grid item>
          <ButtonGroup size="large" color="primary" disabled={state.pending}>
            <Button type="submit" formAction={FormAction.SaveConfig}>
              保存
            </Button>
            <Button type="submit" formAction={FormAction.CheckConfig}>
              检查连接
            </Button>
            <Button type="submit" formAction={FormAction.StartSync}>
              开始同步
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </form>
  )
}

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  ButtonGroup,
  Grid,
} from '@material-ui/core'
import { StatelessComponent, useRef, useMemo, Fragment } from 'react'
import { useLogin } from './login.hook'
import { AppItem } from './AppItem'
import { IntrudctionIconLink } from './IntrudctionIconLink'
import { DisplayMode } from './login.state'
import { RegisterProtocolBtn } from './RegisterProtocolBtn'
import { InputPGPAuthUrlBtn } from './InputPGPAuthUrlBtn'
import { QRScannerBtn } from './QRScannerBtn'

const ShowAuth = (pauth: { auth: string }) => {
  const domain = useMemo(() => {
    try {
      let u = new URL(pauth.auth)
      return u.origin
    } catch (e) {
      return ''
    }
  }, [pauth.auth])
  return <Fragment>{domain}</Fragment>
}

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  header: {
    // paddingBottom: 0,
  },
  itemIncludeInput: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  sbtns: {
    marginTop: theme.spacing(1),
  },
  main: {
    padding: 0,
    overflow: 'auto',
  },
}))

export const LoginCard: StatelessComponent = () => {
  const classes = useStyles()
  const { state, selectUser, updateParams, postForm } = useLogin()
  const pauth = state.params

  const ref = useRef<HTMLFormElement>()
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const form = ref.current
    if (!form) {
      return
    }
    postForm(form)
  }

  const userInput = useRef()
  const authInput = useRef()

  return (
    <form action={pauth.auth} method="POST" ref={ref} onSubmit={handleSubmit}>
      <input type="hidden" name="content" value={state.content} required />
      <Card>
        <CardHeader
          className={classes.header}
          title="登录"
          action={<IntrudctionIconLink />}
        />
        <Divider />
        <CardContent className={classes.main}>
          <List className={classes.list}>
            {state.mode === DisplayMode.Input ? (
              <ListItem divider>
                <TextField
                  label="登录地址"
                  helperText="示例: https://example.com/auth"
                  fullWidth
                  variant="outlined"
                  disabled={state.pending}
                  onChange={(e) => updateParams('auth')(e.target.value)}
                  ref={authInput}
                />
              </ListItem>
            ) : (
              <ListItem divider>
                <ListItemText
                  primary={<ShowAuth auth={pauth.auth} />}
                  secondary="登录地址"
                />
              </ListItem>
            )}
            {state.mode === DisplayMode.Input && (
              <ListItem divider>
                <TextField
                  label="mid"
                  helperText="一段由应用方生成的无意义的魔法字符串"
                  fullWidth
                  variant="outlined"
                  disabled={state.pending}
                  onChange={(e) => updateParams('mid')(e.target.value)}
                />
              </ListItem>
            )}
            <AppItem />
            <Divider />
            <ListItem
              button
              onClick={selectUser}
              disabled={state.pending}
              ref={userInput}
            >
              <ListItemText
                primary={state.selectedUser?.userId || '点击选择要登录的帐号'}
                secondary={
                  state.selectedUser?.userId ? '点击切换登录帐号' : '等待选择中'
                }
              />
            </ListItem>
          </List>
        </CardContent>
        <Divider />
        <CardActions>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                disabled={state.pending}
              >
                登录
              </Button>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                fullWidth
                size="large"
                style={{ whiteSpace: 'nowrap' }}
              >
                <RegisterProtocolBtn />
                <InputPGPAuthUrlBtn />
                <QRScannerBtn />
              </ButtonGroup>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </form>
  )
}

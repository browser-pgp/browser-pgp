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
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { StatelessComponent, useState, useRef, useCallback } from 'react'
import { useLogin } from './login.hook'
import { AppItem } from './AppItem'
import { IntrudctionIconLink } from './IntrudctionIconLink'
import { EmptyInputFocus, DisplayMode } from './login.state'
import { RegisterProtocolBtn } from './RegisterProtocolBtn'
import { InputPGPAuthUrlBtn } from './InputPGPAuthUrlBtn'

const useStyles = makeStyles(() => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  header: {
    paddingBottom: 0,
  },
  itemIncludeInput: {
    paddingLeft: 0,
    paddingRight: 0,
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
  const appInput = useRef()

  return (
    <form action={pauth.auth} method="POST" ref={ref} onSubmit={handleSubmit}>
      <input type="hidden" name="content" value={state.content} required />
      <Card>
        <CardHeader
          className={classes.header}
          title="登录"
          subheader={state.mode === DisplayMode.Input ? '手动登录' : pauth.auth}
          action={<IntrudctionIconLink />}
        />
        <CardContent>
          <List className={classes.list}>
            {state.mode === DisplayMode.Input && (
              <ListItem className={classes.itemIncludeInput}>
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
            )}
            {state.mode === DisplayMode.Input && (
              <ListItem className={classes.itemIncludeInput}>
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
        <CardActions>
          <ButtonGroup size="large" style={{ whiteSpace: 'nowrap' }}>
            <RegisterProtocolBtn />
            <InputPGPAuthUrlBtn />
          </ButtonGroup>
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
        </CardActions>
      </Card>
    </form>
  )
}

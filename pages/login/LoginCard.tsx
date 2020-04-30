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
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { StatelessComponent, useState, useRef, useCallback } from 'react'
import { useLogin } from './login.hook'
import { AppItem } from './AppItem'

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
  const { state, selectUser, updateParams } = useLogin()
  const pauth = state.params
  const ref = useRef<HTMLFormElement>()
  const [{ showUpdateAuthInput, showUpdateMidInput }] = useState({
    showUpdateAuthInput: !pauth.auth,
    showUpdateMidInput: !pauth.mid,
  })
  const submit = useCallback(
    (e: any) => {
      e.preventDefault()
      const form = ref.current
      if (!form) {
        return
      }
      form.submit()
    },
    [ref],
  )
  return (
    <form action={pauth.auth} method="POST" ref={ref} onSubmit={submit}>
      <input type="hidden" name="content" value={state.content} required />
      <Card>
        <CardHeader
          className={classes.header}
          title="登录"
          subheader={showUpdateAuthInput ? '手动登录' : pauth.auth}
        />
        <CardContent>
          <List className={classes.list}>
            {showUpdateAuthInput && (
              <ListItem className={classes.itemIncludeInput}>
                <TextField
                  label="登录地址"
                  helperText="示例: https://example.com/auth"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => updateParams('auth')(e.target.value)}
                />
              </ListItem>
            )}
            {showUpdateMidInput && (
              <ListItem className={classes.itemIncludeInput}>
                <TextField
                  label="mid"
                  helperText="一段由登录方生成的无意义的魔法字符串"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => updateParams('mid')(e.target.value)}
                />
              </ListItem>
            )}
            <AppItem />
            <Divider />
            <ListItem button onClick={selectUser}>
              <ListItemText
                primary={state.selectedUser?.userId || "点击选择要登录的帐号"}
                secondary={
                  state.selectedUser?.userId ? "将要登录的帐号" : '等待选择中'
                }
              />
            </ListItem>
          </List>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            type="submit"
          >
            登录
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
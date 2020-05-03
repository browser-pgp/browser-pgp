import { useLogin } from './login.hook'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import DetailsIcon from '@material-ui/icons/Details'
import { AppStatus } from './login.state'
import { useEffect } from 'react'

export const AppItem = () => {
  const {
    state: { app, pending, params },
    tryFindApp,
    importUser,
    pickOne,
  } = useLogin()
  useEffect(() => {
    tryFindApp()
  }, [params.fingerprint])
  if (app === null) {
    return (
      <ListItem button disabled>
        <ListItemText primary="尝试匹配网站指纹中..." />
      </ListItem>
    )
  }
  switch (app.status) {
    case AppStatus.NotFound:
      return (
        <ListItem button onClick={importUser} disabled={pending}>
          <ListItemText primary="没有指纹匹配的网站公钥, 点击导入公钥" />
        </ListItem>
      )
    case AppStatus.Found:
      return (
        <ListItem button>
          <ListItemText primary={app.userId} secondary="登录应用" />
        </ListItem>
      )
    case AppStatus.MultiPickedOne:
      return (
        <ListItem button onClick={pickOne} disabled={pending}>
          <ListItemText
            primary={app.userId}
            secondary="再次点击可选择另一个应用"
          />
          <ListItemSecondaryAction>
            <DetailsIcon />
          </ListItemSecondaryAction>
        </ListItem>
      )
    case AppStatus.Multi:
      return (
        <ListItem button onClick={pickOne} disabled={pending}>
          <ListItemText
            primary="点击选择要登录的应用"
            secondary="有多个指纹匹配的应用, 需要进一步选择要登录的应用"
          />
          <ListItemSecondaryAction>
            <DetailsIcon />
          </ListItemSecondaryAction>
        </ListItem>
      )
  }
}

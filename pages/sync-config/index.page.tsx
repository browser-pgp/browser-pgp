import { MainLayout } from '~pages/layouts'
import {
  List,
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
  Button,
  ButtonGroup,
  TextField,
  Typography,
  Grid,
  Switch,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  LinearProgress,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'

export const Config = () => {
  return (
    <List>
      <ListItem>
        <ListItemText secondary={'实时同步中'}>连接状态</ListItemText>
        <ListItemSecondaryAction>
          <IconButton color="primary">
            <PlayArrowIcon />
          </IconButton>
          <IconButton color="primary">
            <StopIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <form style={{ width: '100%' }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                variant="outlined"
                label="远程地址"
                placeholder="http://"
                helperText="记得把当前站点加到 cors 名单中, 否则会出现跨域问题无法同步"
                multiline
                rowsMax={3}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              <TextField variant="outlined" label="帐号" fullWidth required />
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                label="密码"
                type="password"
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              <ButtonGroup size="large" color="primary">
                <Button>保存</Button>
                <Button>检查连接</Button>
                <Button disabled>手动同步</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </ListItem>
      <ListItem>
        <ListItemText secondary="打开后会在浏览时自动同步">
          实时同步
        </ListItemText>
        <ListItemSecondaryAction>
          <Switch color="primary" />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  )
}

export default () => {
  return (
    <MainLayout title="远程同步">
      <Grid container>
        <Grid item xs={6}>
          <Card>
            <CardHeader title="远程同步设置" subheader="" />
            <CardContent style={{ paddingTop: 0 }}>
              <Config />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  )
}

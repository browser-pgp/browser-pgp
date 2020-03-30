import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  ListSubheader,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import { SyncStatus, SyncState } from './sync.state'
import { useSync } from './sync.hook'
import { Fragment } from 'react'

const StatusDisplayText = () => {
  const {
    state: { status },
  } = useSync()
  let t = ''
  switch (status) {
    case SyncStatus.CheckConfig:
      t = '检查配置中'
      break
    case SyncStatus.WrongConfig:
      t = '等待有效配置中'
      break
    case SyncStatus.Ready:
      t = '准备就绪'
      break
    case SyncStatus.NoPassword:
      t = '等待输入密码中'
      break
    case SyncStatus.Pending:
      t = '同步中'
      break
    case SyncStatus.Finished:
      t = '同步完成'
      break
  }
  return <Fragment>{t}</Fragment>
}

const ActionButton = () => {
  const {
    state: { status, savedConfig },
    startSync,
    stopSync,
  } = useSync()
  switch (status) {
    default:
      let d = status !== SyncStatus.Ready
      return (
        <Tooltip title="开始同步">
          <span>
            <IconButton
              color="primary"
              disabled={d}
              onClick={() => startSync(savedConfig)}
            >
              <PlayArrowIcon />
            </IconButton>
          </span>
        </Tooltip>
      )
    case SyncStatus.Pending:
      return (
        <IconButton color="primary" onClick={() => stopSync()}>
          <StopIcon />
        </IconButton>
      )
  }
}

export const SyncStatusDisplay = () => {
  return (
    <ListItem>
      <ListItemText secondary={<StatusDisplayText />}>连接状态</ListItemText>
      <ListItemSecondaryAction>
        <ActionButton />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

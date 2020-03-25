import { useKeyInfo } from './KeyInfo.hook'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
} from '@material-ui/core'
import { KeyInfo } from './KeyInfo'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useSnackbar } from 'notistack'
import { Alert, AlertTitle } from '@material-ui/lab'

export const KeyInfoDialog = () => {
  const { state, close } = useKeyInfo()
  const { enqueueSnackbar } = useSnackbar()

  let body: JSX.Element
  if (state.pending) {
    body = <LinearProgress />
  } else if (state.err) {
    body = (
      <Alert severity='error'>
        <AlertTitle>解析公钥失败</AlertTitle>
        {state.err}
      </Alert>
    )
  } else {
    body = <KeyInfo data={state.key} />
  }

  return (
    <Dialog open={state.open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>公钥属性查看</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button onClick={close}>关闭</Button>
        <CopyToClipboard
          text={state.pubKey}
          onCopy={() => enqueueSnackbar('复制公钥成功')}
        >
          <Button>复制</Button>
        </CopyToClipboard>
        <Button>导出公钥</Button>
      </DialogActions>
    </Dialog>
  )
}

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

export const KeyInfoDialog = () => {
  const { state, close } = useKeyInfo()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Dialog open={state.open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>公钥属性查看</DialogTitle>
      <DialogContent>
        {state.pending ? <LinearProgress /> : <KeyInfo data={state.key} />}
      </DialogContent>
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

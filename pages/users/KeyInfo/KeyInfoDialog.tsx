import { useKeyInfo } from './KeyInfo.hook'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
} from '@material-ui/core'
import { useEffect } from 'react'
import { KeyInfo } from './KeyInfo'

export const KeyInfoDialog = () => {
  const { state, close, parsePubKey } = useKeyInfo()

  useEffect(() => {
    if (!state.pubKey) {
      return
    }
    parsePubKey(state.pubKey)
  }, [state.pubKey])

  return (
    <Dialog open={state.open} onClose={close}>
      <DialogTitle>公钥属性查看</DialogTitle>
      <DialogContent>
        {state.pending ? <LinearProgress /> : <KeyInfo data={state.key} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>关闭</Button>
        <Button>导出公钥</Button>
      </DialogActions>
    </Dialog>
  )
}

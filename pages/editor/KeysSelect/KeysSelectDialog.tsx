import { Dialog } from '@material-ui/core'
import { useKeysSelect } from './KeysSelect.hook'
import { KeysSelect } from './KeysSelect'

export const KeysSelectDialog = () => {
  const { state, close } = useKeysSelect()

  return (
    <Dialog open={state.open} fullWidth maxWidth="md" onClose={close}>
      <KeysSelect keyType={state.keyType} />
    </Dialog>
  )
}

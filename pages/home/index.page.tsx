import { useOpenPGP } from '~modules/openpgp'
import {
  TextField,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  useTheme,
} from '@material-ui/core'
import { useState } from 'react'
import { useHome } from './home.hook'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useSnackbar } from 'notistack'

export const HomePage = () => {
  const [input, setInput] = useState('')
  const { state, encrypt, decrypt, verify, sign } = useHome()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

  return (
    <Container
      style={{ paddingTop: theme.spacing(3), paddingBottom: theme.spacing(3) }}
    >
      <Card>
        <CardHeader title="OpenPGP in Browser" />
        <CardContent>
          <TextField
            disabled={state.pending}
            multiline
            fullWidth
            variant="outlined"
            rows={5}
            rowsMax={12}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </CardContent>
        <CardActions>
          <Button disabled={state.pending} onClick={() => encrypt(input)}>
            加密
          </Button>
          <Button disabled={state.pending} onClick={() => decrypt(input)}>
            解密
          </Button>
          <Button disabled={state.pending} onClick={() => sign(input)}>
            签名
          </Button>
          <Button disabled={state.pending} onClick={() => verify(input)}>
            确认签名
          </Button>
          <CopyToClipboard
            text={state.displayText}
            onCopy={() => enqueueSnackbar('复制成功')}
          >
            <Button disabled={state.pending}>复制</Button>
          </CopyToClipboard>
        </CardActions>
        <CardContent>
          <TextField
            value={state.displayText}
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            rowsMax={10}
          />
        </CardContent>
      </Card>
    </Container>
  )
}

import { HomeState } from './home.state'
export default () => {
  return (
    <HomeState.Provider>
      <HomePage />
    </HomeState.Provider>
  )
}

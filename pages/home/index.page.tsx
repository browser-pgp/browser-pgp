import { useOpenPGP } from '~modules/openpgp'
import {
  TextField,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
} from '@material-ui/core'
import { useState } from 'react'

export const HomePage = () => {
  const pgp = useOpenPGP()

  const [input, setInput] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [pending, set] = useState(false)

  const encrpt = () => {}

  return (
    <Container>
      <Card>
        <CardHeader title="OpenPGP in Browser" />
        <CardContent>
          <TextField
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
          <Button>加密</Button>
          <Button>解密</Button>
          <Button>复制</Button>
        </CardActions>
        <CardContent>
          <TextField
            value={displayText}
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

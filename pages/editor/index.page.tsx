import { MainLayout } from '~pages/layouts'
import { Editor } from '~pages/components/Editor'
import { Button, Card, CardActions, CardContent } from '@material-ui/core'
import { useEditor } from './editor.hook'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useSnackbar } from 'notistack'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
    // paddingBottom: theme.spacing(3),
  },
  editor: {
    height: '80vh',
  },
}))

export const EditorPage = () => {
  const classes = useStyles()
  const { state, encrypt, decrypt, sign, verify } = useEditor()
  const [{ editor }] = EditorState.useContainer()
  const { enqueueSnackbar } = useSnackbar()
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!editor) {
      return
    }
    editor.updateOptions({
      readOnly: state.pending,
    })
  }, [state.pending])

  return (
    <MainLayout>
      <Card>
        <CardActions>
          <CopyToClipboard
            text={input}
            onCopy={() => enqueueSnackbar('复制成功')}
          >
            <Button variant="outlined">复制</Button>
          </CopyToClipboard>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => encrypt(input)}
          >
            加密
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => decrypt(input)}
          >
            解密
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => sign(input)}
          >
            签名
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => verify(input)}
          >
            查看签名
          </Button>
        </CardActions>
        <CardContent className={classes.root}>
          <Editor classes={[classes.editor]} onChange={(e, v) => setInput(v)} />
        </CardContent>
      </Card>
    </MainLayout>
  )
}

import { EditorState as EditorPageState } from './editor.state'
import { EditorState } from '~pages/components/Editor'
import { useEffect, useState } from 'react'
import { KeysSelectState, KeysSelectDialog } from './KeysSelect'
import { KeyPasswordAskState, KeyPasswordAskDialog } from './KeyPasswordAsk'
import { KeyInfoState, KeyInfoDialog } from '~pages/users/KeyInfo'
import { PrivateKeyCacheState } from './PrivateKeyCache'
export default () => {
  return (
    <EditorPageState.Provider>
      <EditorState.Provider>
        <KeysSelectState.Provider>
          <KeyPasswordAskState.Provider>
            <PrivateKeyCacheState.Provider>
              <KeyInfoState.Provider>
                <KeysSelectDialog />
                <KeyPasswordAskDialog />
                <KeyInfoDialog />
                <EditorPage />
              </KeyInfoState.Provider>
            </PrivateKeyCacheState.Provider>
          </KeyPasswordAskState.Provider>
        </KeysSelectState.Provider>
      </EditorState.Provider>
    </EditorPageState.Provider>
  )
}

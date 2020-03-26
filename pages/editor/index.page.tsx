import { MainLayout } from '~pages/layouts'
import { Editor } from '~pages/components/Editor'
import { Button, Card, CardActions, CardContent } from '@material-ui/core'
import { useEditor } from './editor.hook'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useSnackbar } from 'notistack'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'

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
  hidden: {
    display: 'none',
  },
}))

export const EditorPage = () => {
  const classes = useStyles()
  const { state, encrypt, decrypt, sign, verify, signOrVerify } = useEditor()
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
            <Button variant="outlined" startIcon={<FileCopyIcon />}>
              复制
            </Button>
          </CopyToClipboard>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => signOrVerify(input)}
            startIcon={<EditIcon />}
          >
            签名/核对
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => encrypt(input)}
            startIcon={<LockIcon />}
          >
            加密
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => decrypt(input)}
            startIcon={<LockOpenIcon />}
          >
            解密
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => sign(input)}
            className={classes.hidden}
          >
            签名
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => verify(input)}
            className={classes.hidden}
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
import { KeysSelectProvider } from './KeysSelect'
import { KeyInfoProvider } from '~pages/users/KeyInfo'
export default () => {
  return (
    <EditorPageState.Provider>
      <EditorState.Provider>
        <KeysSelectProvider>
          <KeyInfoProvider>
            <EditorPage />
          </KeyInfoProvider>
        </KeysSelectProvider>
      </EditorState.Provider>
    </EditorPageState.Provider>
  )
}

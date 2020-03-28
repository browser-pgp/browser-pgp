import { MainLayout } from '~pages/layouts'
import { Editor } from '~pages/components/Editor'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  LinearProgress,
} from '@material-ui/core'
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
    if (!state.pending) {
      editor.focus()
    }
  }, [state.pending])
  useEffect(() => {
    state.model.onDidChangeContent(() => {
      setInput(state.model.getValue())
    })
    return () => {
      state.model.dispose()
    }
  }, [state.model])

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
            onClick={() => signOrVerify()}
            startIcon={<EditIcon />}
          >
            签名/核对
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => encrypt()}
            startIcon={<LockIcon />}
          >
            加密
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => decrypt()}
            startIcon={<LockOpenIcon />}
          >
            解密
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => sign()}
            className={classes.hidden}
          >
            签名
          </Button>
          <Button
            variant="outlined"
            disabled={state.pending}
            onClick={() => verify()}
            className={classes.hidden}
          >
            查看签名
          </Button>
        </CardActions>
        <LinearProgress style={state.pending ? {} : { visibility: 'hidden' }} />
        <CardContent className={classes.root}>
          <Editor classes={[classes.editor]} options={{ model: state.model }} />
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

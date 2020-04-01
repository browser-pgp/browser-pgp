import { MainLayout } from '~pages/layouts'
import { Editor } from '~pages/components/Editor'
import {
  Button,
  LinearProgress,
  Grid,
  ButtonGroup,
  Paper,
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
    height: '100%',
  },
  editorWrapper: {
    flexGrow: 1,
  },
  btnWrapper: {
    padding: theme.spacing(2),
  },
  hidden: {
    display: 'none',
  },
}))

export const EditorPage = () => {
  const classes = useStyles()
  const { state, encrypt, decrypt, signOrVerify } = useEditor()
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
    <MainLayout title="编辑器" inContainer>
      <Grid
        container
        direction="column"
        className={classes.root}
        component={Paper}
      >
        <Grid item className={classes.btnWrapper}>
          <ButtonGroup>
            <CopyToClipboard
              text={input}
              onCopy={() => enqueueSnackbar('复制成功')}
            >
              <Button startIcon={<FileCopyIcon />}>复制</Button>
            </CopyToClipboard>
            <Button
              disabled={state.pending}
              onClick={() => signOrVerify()}
              startIcon={<EditIcon />}
            >
              签名/核对
            </Button>
            <Button
              disabled={state.pending}
              onClick={() => encrypt()}
              startIcon={<LockIcon />}
            >
              加密
            </Button>
            <Button
              disabled={state.pending}
              onClick={() => decrypt()}
              startIcon={<LockOpenIcon />}
            >
              解密
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <LinearProgress
            style={state.pending ? {} : { visibility: 'hidden' }}
          />
        </Grid>
        <Grid item className={classes.editorWrapper}>
          <Editor options={{ model: state.model }} />
        </Grid>
      </Grid>
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

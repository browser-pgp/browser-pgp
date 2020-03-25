import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core'
import { useImportUser } from './ImportUser.hook'
import { Editor, EditorState } from '~pages/components/Editor'
import { useKeyInfo } from '../KeyInfo'
import monaco from 'monaco-editor'
import { useState, Fragment, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  editor: {
    height: 375,
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
}))

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
}

let defaultPubKey = ``

const ImportUserForm = () => {
  const keyInfo = useKeyInfo()
  const [pubKey, setPubKey] = useState(defaultPubKey)
  const u = useImportUser()
  const classes = useStyles()
  const [{ editor }] = EditorState.useContainer()
  useEffect(() => {
    if (!editor) {
      return
    }
    editor.updateOptions({
      readOnly: u.state.pending,
    })
  }, [u.state.pending])
  return (
    <Fragment>
      <DialogTitle>导入公钥</DialogTitle>
      <DialogContent className={classes.content}>
        <Editor
          classes={[classes.editor]}
          options={options}
          onChange={(e, v) => setPubKey(v)}
          value={defaultPubKey}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={u.state.pending} onClick={() => u.close()}>
          取消
        </Button>
        <Button onClick={() => keyInfo.open(pubKey)}>查看</Button>
        <Button
          type="submit"
          color="primary"
          onClick={() => u.importUser(pubKey)}
          disabled={u.state.pending}
        >
          导入
        </Button>
      </DialogActions>
    </Fragment>
  )
}

const WrapperImportUserForm = () => {
  return (
    <EditorState.Provider>
      <ImportUserForm />
    </EditorState.Provider>
  )
}

export { WrapperImportUserForm as ImportUserForm }

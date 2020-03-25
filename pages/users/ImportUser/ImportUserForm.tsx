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
import type monaco from 'monaco-editor'
import { useState, Fragment } from 'react'

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

export const ImportUserForm = () => {
  const keyInfo = useKeyInfo()
  const [pubKey, setPubKey] = useState('')
  const classes = useStyles()
  return (
    <Fragment>
      <DialogTitle>导入公钥</DialogTitle>
      <DialogContent className={classes.content}>
        <EditorState.Provider>
          <Editor
            classes={[classes.editor]}
            options={options}
            onChange={(e, v) => setPubKey(v)}
          />
        </EditorState.Provider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => keyInfo.open(pubKey)}>查看</Button>
        <Button type="submit" color="primary">
          导入
        </Button>
      </DialogActions>
    </Fragment>
  )
}

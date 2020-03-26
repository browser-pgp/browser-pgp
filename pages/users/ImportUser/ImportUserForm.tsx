import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
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
  head: {
    paddingBottom: theme.spacing(1),
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  tabs: {
    minHeight: 0,
  },
  tab: {
    minHeight: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  tabIndicator: {
    minWidth: 0,
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
  const [v, setV] = useState(0)
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
      <DialogTitle className={classes.head}>用户导入</DialogTitle>
      <DialogContent className={classes.content}>
        <Tabs
          variant="scrollable"
          indicatorColor="primary"
          className={classes.tabs}
          TabIndicatorProps={{ className: classes.tabIndicator }}
          value={v}
          onChange={(e, v) => setV(v)}
        >
          <Tab className={classes.tab} label="公钥" value="0" />
          <Tab className={classes.tab} label="私钥" value="1" />
          <Tab className={classes.tab} label="吊销证书" value="2" />
        </Tabs>
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

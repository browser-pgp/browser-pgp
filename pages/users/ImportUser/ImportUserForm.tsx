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
import { EditorModel } from './ImportUser.state'

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

const createTab = (value: EditorModel, displayName: string) => ({
  displayName,
  value,
})
const tabs = [
  createTab(EditorModel.PublicKey, '公钥'),
  createTab(EditorModel.PrivateKey, '私钥'),
  createTab(EditorModel.RevocationCertificate, '吊销证书'),
]

export const ImportUserForm = () => {
  const keyInfo = useKeyInfo()
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
  useEffect(() => {
    if (!editor) {
      return
    }
    if (u.state.open) {
      let lastViewState = u.viewState[u.state.focus]
      console.log('lastViewState', lastViewState)
      if (lastViewState) {
        editor.restoreViewState(lastViewState)
      }
    } else {
      let currentViewState = editor.saveViewState()
      u.setViewState(s => ({
        ...s,
        [u.state.focus]: currentViewState,
      }))
    }
  }, [u.state.open, editor])
  useEffect(() => {
    if (!editor) {
      return
    }
    editor.setModel(u.state.models[u.state.focus])
    editor.focus()
    let lastViewState = u.viewState[u.state.focus]
    if (lastViewState) {
      editor.restoreViewState(lastViewState)
    }
  }, [u.state.focus])
  return (
    <Fragment>
      <DialogTitle className={classes.head}>用户导入</DialogTitle>
      <DialogContent className={classes.content}>
        <Tabs
          variant="scrollable"
          indicatorColor="primary"
          className={classes.tabs}
          TabIndicatorProps={{ className: classes.tabIndicator }}
          value={u.state.focus}
          onChange={(e, v) => u.changeEditorTab(v, editor)}
        >
          {tabs.map(t => (
            <Tab
              className={classes.tab}
              key={t.value}
              label={t.displayName}
              value={t.value}
            />
          ))}
        </Tabs>
        <Editor
          classes={[classes.editor]}
          options={{
            ...options,
            model: u.state.models[u.state.focus],
          }}
          value={defaultPubKey}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={u.state.pending} onClick={() => u.close()}>
          取消
        </Button>
        <Button
          onClick={() => keyInfo.open(u.state.models[u.state.focus].getValue())}
        >
          查看
        </Button>
        <Button
          type="submit"
          color="primary"
          onClick={() => u.importUser()}
          disabled={u.state.pending}
        >
          导入
        </Button>
      </DialogActions>
    </Fragment>
  )
}

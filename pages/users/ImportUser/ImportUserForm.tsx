import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  LinearProgress,
} from '@material-ui/core'
import { useImportUser } from './ImportUser.hook'
import {
  Editor,
  EditorState,
  SimpleEditorConstructionOptions,
} from '~pages/components/SimpleEditor'
import { useKeyInfo } from '../KeyInfo'
import { useState, Fragment, useEffect } from 'react'
import { EditorModel } from './ImportUser.state'
import { useDelUser } from '../DelUser'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  editor: {
    height: '40vh',
    minHeight: 375,
    maxHeight: 500,
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

const options: SimpleEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
}

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
  const del = useDelUser()
  const classes = useStyles()
  const [{ editor }] = EditorState.useContainer()
  useEffect(() => {
    if (!editor) {
      return
    }
    if (u.state.pending) {
      editor.updateOptions({
        readOnly: u.state.pending,
      })
      return
    }
    editor.updateOptions({
      readOnly: u.isShouldMakePublicKeyReadOnly(),
    })
  }, [u.state.pending])
  useEffect(() => {
    if (!editor) {
      return
    }
    editor.updateOptions({
      readOnly: u.isShouldMakePublicKeyReadOnly(),
    })
    if (u.state.open) {
      let lastViewState = u.viewState[u.state.focus]
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
      <DialogTitle className={classes.head}>
        {u.state.id ? '更新用户' : '用户导入'}
        {u.state.id && (
          <Button
            style={{ float: 'right' }}
            onClick={() =>
              del
                .open(u.state.id as string)
                .then(deleted => deleted && u.close())
            }
          >
            删除
          </Button>
        )}
      </DialogTitle>
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
              disabled={u.state.pending}
              value={t.value}
            />
          ))}
        </Tabs>
        <LinearProgress
          style={u.state.pending ? {} : { visibility: 'hidden' }}
        />
        <Editor
          classes={[classes.editor]}
          options={{
            ...options,
            model: u.state.models[u.state.focus],
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={u.state.pending} onClick={() => u.close()}>
          取消
        </Button>
        {(u.viewState[EditorModel.PrivateKey] ||
          u.state.focus === EditorModel.PrivateKey) && (
          <Button onClick={() => u.checkPrivateKey(editor)}>检查密钥对</Button>
        )}
        <Button
          onClick={() => keyInfo.open(u.state.models[u.state.focus].getValue())}
        >
          查看公钥
        </Button>
        {u.state.id ? (
          <Button
            type="submit"
            color="primary"
            onClick={() => u.importUser(editor)}
            disabled={u.state.pending}
          >
            更新
          </Button>
        ) : (
          <Button
            type="submit"
            color="primary"
            onClick={() => u.importUser(editor)}
            disabled={u.state.pending}
          >
            导入
          </Button>
        )}
      </DialogActions>
    </Fragment>
  )
}

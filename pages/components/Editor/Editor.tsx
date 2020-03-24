import React, { useRef, useEffect } from 'react'
import type monaco from "monaco-editor";
import { makeStyles } from '@material-ui/core'
import { useEditor } from './Editor.hook'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
}))

export interface Props {
  onChange?: (e: monaco.editor.IModelContentChangedEvent, value: string) => any
}

export const Editor: React.StatelessComponent<Props> = props => {
  const editor = useEditor()
  const classes = useStyles()
  const f = useRef()
  useEffect(() => {
    if (!f.current) {
      return
    }
    if (editor.state.editor) {
      return
    }
    const model = editor.init(f.current)
    if (typeof props.onChange === 'function') {
      model.onDidChangeContent(e => {
        props.onChange(e, model.getValue())
      })
    }
    return editor.destory
  }, [f.current])

  return <div className={classes.root} ref={f}></div>
}
export default Editor

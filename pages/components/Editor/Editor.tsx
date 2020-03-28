import React, { useRef, useEffect } from 'react'
import type monaco from 'monaco-editor'
import { makeStyles } from '@material-ui/core'
import { useEditor } from './Editor.hook'
import clsx, { ClassValue } from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
}))

export interface Props {
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  classes?: ClassValue[]
}

export const Editor: React.StatelessComponent<Props> = ({
  options = {},
  classes: propsClasses = [],
}) => {
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
    editor.init(f.current, options)
    return editor.destory
  }, [f.current])

  return <div className={clsx(classes.root, ...propsClasses)} ref={f}></div>
}
export default Editor

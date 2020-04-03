import { useRef, StatelessComponent, useEffect, useState } from 'react'
import { useSimpleEditor } from './SimpleEditor.hook'
import clsx, { ClassValue } from 'clsx'
import { Typography, Paper } from '@material-ui/core'

import { makeStyles } from '@material-ui/core'
import { SimpleTextModel } from './SimpleEditor.class'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 1, 1, 1),
  },
  editor: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: theme.spacing(1.5),
    border: 'none',
    outline: 'none',
    resize: 'none',
    overflowY: 'auto',
    fontSize: 14,
  },
}))

export interface Props {
  options?: { model: SimpleTextModel }
  classes?: ClassValue[]
}

export const SimpleEditor: StatelessComponent<Props> = ({
  options = {},
  classes: propsClasses = [],
}) => {
  const classes = useStyles()
  const editor = useSimpleEditor()
  const [elevation, setElevation] = useState(0)
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

  return (
    <Paper className={classes.root}>
      <Paper
        component="textarea"
        ref={f}
        elevation={2}
        onFocus={() => setElevation(2)}
        onBlur={() => setElevation(0)}
        className={clsx(classes.editor, ...propsClasses)}
      />
    </Paper>
  )
}

import { useRef, StatelessComponent, useEffect } from 'react'
import { useSimpleEditor } from './SimpleEditor.hook'
import { Props } from '../Editor/Editor'
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
}))

export const SimpleEditor: StatelessComponent<Props> = ({
  options = {},
  classes: propsClasses = [],
}) => {
  const classes = useStyles()
  const editor = useSimpleEditor()
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

  return <textarea ref={f} className={clsx(classes.root, ...propsClasses)} />
}

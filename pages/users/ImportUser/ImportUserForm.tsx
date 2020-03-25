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
const t = `
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

xjMEXnmCqBYJKwYBBAHaRw8BAQdABbtMCNbHXjWM+8k2IRzwht2Lyek4zBu9
fus7SGDFy5/NG3NoeW5vbWUgPHNoeW5vbWVAZ2FtaWwuY29tPsJ4BBAWCgAg
BQJeeYKoBgsJBwgDAgQVCAoCBBYCAQACGQECGwMCHgEACgkQ6RACh1yscRUy
gQD7BL6zVmDdn/LgAoADjEKxNd4m02mwpfKCawQZp/St+wsBAJEmLf7zZWI9
ORoOGdFpCY3E/BAjK4lmskkDN7cL81wAzjgEXnmCqBIKKwYBBAGXVQEFAQEH
QJwv0spym2LTKG4ja7Zo63CjqvJCKSY9HS1RBoXWCtMaAwEIB8JhBBgWCAAJ
BQJeeYKoAhsMAAoJEOkQAodcrHEVeocA+wQ2cJ33qm9bSKpWBespA2HhB0MG
57koyBzqBUrWk4sNAQCQLx6/lpSWeOVsV5pBLmi4YiCBhdXq2BXK+Kk2bD5v
Dg==
=eoj6
-----END PGP PUBLIC KEY BLOCK-----
`

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

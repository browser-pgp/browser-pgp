import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@material-ui/core'
import { useUserKeyCheck } from './UserKeyCheck.hook'
import { NewUserKeyForm } from './NewUserKeyForm'
import { UserKeyDecrypt } from './UserKeyDecrypt'
import { Fragment, useEffect } from 'react'
import { SessionStoreName } from './constants'

export const UserKeyCheckDialog = () => {
  const {
    state,
    setState,
    getUserPubKey,
    decryptPrivateKey,
    close,
  } = useUserKeyCheck()

  useEffect(() => {
    let password = sessionStorage.getItem(SessionStoreName.PasswordKey)
    if (password) {
      decryptPrivateKey(password).then(() => {
        close()
      })
      return
    }
    if (state.hasPubKey !== null) {
      return
    }
    getUserPubKey()
  }, [state.hasPubKey])

  let body: JSX.Element
  if (state.hasPubKey === null) {
    body = (
      <Fragment>
        <DialogTitle>检查公钥中</DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Fragment>
    )
  } else if (state.hasPubKey == false) {
    body = <NewUserKeyForm />
  } else if (state.decryptedKey == false) {
    body = <UserKeyDecrypt />
  } else {
    body = (
      <Fragment>
        <DialogTitle>检查通过</DialogTitle>
      </Fragment>
    )
  }
  return (
    <Dialog open={state.open} maxWidth="sm" fullWidth>
      {body}
    </Dialog>
  )
}

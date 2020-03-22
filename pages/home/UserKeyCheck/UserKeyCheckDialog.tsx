import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@material-ui/core'
import { useUserKeyCheck } from './UserKeyCheck.hook'
import { NewUserKeyForm } from './NewUserKeyForm'
import { Fragment, useEffect } from 'react'

export const UserKeyCheckDialog = () => {
  const { state, setState, getUserPubKey } = useUserKeyCheck()

  useEffect(() => {
    if (state.hasPubKey !== null) {
      return
    }
    getUserPubKey().then(() => {
      setState(s => {
        if (s.hasPubKey) {
          setState(s => ({ ...s, open: false }))
        }
        return s
      })
    })
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

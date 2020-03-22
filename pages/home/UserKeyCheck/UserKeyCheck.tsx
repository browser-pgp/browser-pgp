import { Fragment, StatelessComponent } from 'react'
import { UserKeyCheckDialog } from './UserKeyCheckDialog'
import { useUserKeyCheck } from './UserKeyCheck.hook'

export const UserKeyCheck: StatelessComponent = props => {
  const { state } = useUserKeyCheck()
  return (
    <Fragment>
      <UserKeyCheckDialog />
      {!state.open && props.children}
    </Fragment>
  )
}

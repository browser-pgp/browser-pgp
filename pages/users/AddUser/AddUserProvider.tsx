import { AddUserState } from './AddUser.state'
import { AddUserDialog } from './AddUserDialog'
import { StatelessComponent } from 'react'

export const AddUserProvider: StatelessComponent = props => {
  return (
    <AddUserState.Provider>
      <AddUserDialog />
      {props.children}
    </AddUserState.Provider>
  )
}

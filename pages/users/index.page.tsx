import { Container, LinearProgress } from '@material-ui/core'
import { myDatabase } from '~libs/db'
import { useObservable } from 'rxjs-hooks'
import { UserList } from './UserList'

export const UsersPage = () => {
  const users = useObservable(() => myDatabase.users.find().$)
  return (
    <Container>
      {users === null && <LinearProgress />}
      <UserList users={users || []} />
    </Container>
  )
}

import { AddUserState, AddUserDialog } from './AddUser'
import { DelUserState, DelUserDialog } from './DelUser'
import { KeyInfoState, KeyInfoDialog } from './KeyInfo'
export default () => {
  return (
    <AddUserState.Provider>
      <DelUserState.Provider>
        <KeyInfoState.Provider>
          <AddUserDialog />
          <DelUserDialog />
          <KeyInfoDialog />
          <UsersPage />
        </KeyInfoState.Provider>
      </DelUserState.Provider>
    </AddUserState.Provider>
  )
}

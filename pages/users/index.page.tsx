import { Container, LinearProgress } from '@material-ui/core'
import { myDatabase } from '~libs/db'
import { useObservable } from 'rxjs-hooks'
import { UserList } from './UserList'
import { MainLayout } from "~pages/layouts";

export const UsersPage = () => {
  const users = useObservable(() => myDatabase.users.find().$)
  return (
    <MainLayout>
      {users === null && <LinearProgress />}
      <UserList users={users || []} />
    </MainLayout>
  )
}

import { AddUserState, AddUserDialog } from './AddUser'
import { DelUserState, DelUserDialog } from './DelUser'
import { KeyInfoState, KeyInfoDialog } from './KeyInfo'
import { ImportUserState, ImportUserDialog } from './ImportUser'
export default () => {
  return (
    <AddUserState.Provider>
      <DelUserState.Provider>
        <KeyInfoState.Provider>
          <ImportUserState.Provider>
            <AddUserDialog />
            <DelUserDialog />
            <KeyInfoDialog />
            <ImportUserDialog />
            <UsersPage />
          </ImportUserState.Provider>
        </KeyInfoState.Provider>
      </DelUserState.Provider>
    </AddUserState.Provider>
  )
}

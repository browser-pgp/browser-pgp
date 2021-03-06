import { LinearProgress } from '@material-ui/core'
import { myDatabase } from '~libs/db'
import { useObservable } from 'rxjs-hooks'
import { UserList } from './UserList'
import { MainLayout } from '~pages/layouts'

export const UsersPage = () => {
  const users = useObservable(() => myDatabase.users.find().$)
  return (
    <MainLayout title="联系人管理" inContainer>
      {users === null && <LinearProgress />}
      <UserList users={users || []} />
    </MainLayout>
  )
}

import { AddUserProvider } from './AddUser'
import { DelUserProvider } from './DelUser'
import { KeyInfoProvider } from './KeyInfo'
import { ImportUserProvider } from './ImportUser'
export default function Page() {
  return (
    <AddUserProvider>
      <DelUserProvider>
        <KeyInfoProvider>
          <ImportUserProvider>
            <UsersPage />
          </ImportUserProvider>
        </KeyInfoProvider>
      </DelUserProvider>
    </AddUserProvider>
  )
}

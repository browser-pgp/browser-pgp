import {} from 'react'
import { Container } from '@material-ui/core'
import { useFind } from 'react-pouchdb'

export const UsersPage = () => {
  const docs = useFind({})
  console.log('docs', docs)
  return (
    <Container>
      <ul>
        <li></li>
      </ul>
    </Container>
  )
}

import { UsersState } from './users.state'
export default () => {
  return (
    <UsersState.Provider>
      <UsersPage />
    </UsersState.Provider>
  )
}

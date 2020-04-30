import { Container } from '@material-ui/core'
import { MainLayout, OnePoint } from '~pages/layouts'
import { LoginCard } from './LoginCard'

const LoginPage = () => {
  return (
    <MainLayout title="登录">
      <OnePoint>
        <Container maxWidth="sm">
          <LoginCard />
        </Container>
      </OnePoint>
    </MainLayout>
  )
}

import { KeysSelectProvider } from '~pages/editor/KeysSelect'
import { LoginState } from './login.state'
import { useRouter } from 'next/router'
import { ImportUserProvider } from '~pages/users/ImportUser'
import { KeyInfoProvider } from '~pages/users/KeyInfo'

export default () => {
  const router = useRouter()
  return (
    <KeyInfoProvider>
      <ImportUserProvider>
        <KeysSelectProvider>
          <LoginState.Provider initialState={(router.query || {}) as any}>
            <LoginPage />
          </LoginState.Provider>
        </KeysSelectProvider>
      </ImportUserProvider>
    </KeyInfoProvider>
  )
}

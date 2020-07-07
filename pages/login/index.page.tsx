import { Container } from '@material-ui/core'
import { MainLayout, OnePoint } from '~pages/layouts'
import { LoginCard } from './LoginCard'
import { Params } from './login.state'
import { useRouter, NextRouter } from 'next/router'
import { useMemo, useEffect } from 'react'
import { useLogin } from './login.hook'
import { DisplayMode } from './login.state'

function getParams(router: NextRouter): Params {
  let q = router.query
  if (q.url) {
    let purl = new URL(q.url as string)
    return {
      auth: purl.searchParams.get('auth'),
      mid: purl.searchParams.get('mid'),
      fingerprint: purl.searchParams.get('fingerprint'),
    }
  }
  return q as any
}

const LoginPage = () => {
  const router = useRouter()
  const { setState } = useLogin()
  useEffect(() => {
    let mode = DisplayMode.Input
    if (!!router.query.auth || !!router.query.url) {
      mode = DisplayMode.Auto
    }
    setState((s) => ({
      ...s,
      params: getParams(router),
      mode: mode,
    }))
  }, [router.query])
  return (
    <MainLayout title="登录" inContainer>
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
import { ImportUserProvider } from '~pages/users/ImportUser'
import { KeyInfoProvider } from '~pages/users/KeyInfo'
import { QRScannerProvider } from './QRScanner'
export default function Page() {
  const router = useRouter()
  const parmas = useMemo(() => getParams(router), [])
  return (
    <KeyInfoProvider>
      <ImportUserProvider>
        <KeysSelectProvider>
          <LoginState.Provider initialState={parmas}>
            <QRScannerProvider>
              <LoginPage />
            </QRScannerProvider>
          </LoginState.Provider>
        </KeysSelectProvider>
      </ImportUserProvider>
    </KeyInfoProvider>
  )
}

import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import { CssBaseline } from '@material-ui/core'
import { theme } from './_theme'
import { StatelessComponent } from 'react'
import { KeyPasswordAskProvider } from './users/KeyPasswordAsk'
import { PrivateKeyCacheState } from './users/PrivateKeyCache'

export const Provider: StatelessComponent = props => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <PrivateKeyCacheState.Provider>
      <SnackbarProvider autoHideDuration={2e3}>
        <KeyPasswordAskProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          {props.children}
        </KeyPasswordAskProvider>
      </SnackbarProvider>
    </PrivateKeyCacheState.Provider>
  </ThemeProvider>
)

export default Provider

import { init as initDB } from '~libs/db'
export async function init() {
  await initDB()
}

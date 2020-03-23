import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import { CssBaseline } from '@material-ui/core'
import { theme } from './_theme'
import { StatelessComponent } from 'react'
import { UserKeyCheckState, UserKeyCheck } from './home/UserKeyCheck'
import { OpenPGPState } from '~modules/openpgp'

export const Provider: StatelessComponent = props => (
  <ThemeProvider theme={theme}>
    <SnackbarProvider autoHideDuration={2e3}>
      <UserKeyCheckState.Provider>
        <OpenPGPState.Provider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <UserKeyCheck>{props.children}</UserKeyCheck>
        </OpenPGPState.Provider>
      </UserKeyCheckState.Provider>
    </SnackbarProvider>
  </ThemeProvider>
)

export default Provider

import { init as initDB } from '~libs/db'
export async function init() {
  await initDB()
}

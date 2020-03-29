import { sync } from '~libs/db'
import { Button } from '@material-ui/core'
import { MainLayout } from '~pages/layouts'

export const SettingsPage = () => {
  return (
    <MainLayout title="设置">
      <Button onClick={sync}>同步</Button>
    </MainLayout>
  )
}

import { SettingsState } from './settings.state'
export default () => {
  return (
    <SettingsState.Provider>
      <SettingsPage />
    </SettingsState.Provider>
  )
}

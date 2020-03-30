import { Button } from '@material-ui/core'
import { MainLayout } from '~pages/layouts'

export const SettingsPage = () => {
  return <MainLayout title="设置"></MainLayout>
}

import { SettingsState } from './settings.state'
export default () => {
  return (
    <SettingsState.Provider>
      <SettingsPage />
    </SettingsState.Provider>
  )
}

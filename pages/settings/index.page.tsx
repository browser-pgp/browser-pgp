export const SettingsPage = () => {
  return <div>hello settings</div>
}

import { SettingsState } from './settings.state'
export default () => {
  return (
    <SettingsState.Provider>
      <SettingsPage />
    </SettingsState.Provider>
  )
}

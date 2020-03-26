import { StatelessComponent } from 'react'
import { KeysSelectDialog } from './KeysSelectDialog'
import { KeysSelectState } from './KeysSelect.state'

export const KeysSelectProvider: StatelessComponent = props => {
  return (
    <KeysSelectState.Provider>
      <KeysSelectDialog />
      {props.children}
    </KeysSelectState.Provider>
  )
}

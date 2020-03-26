import { StatelessComponent } from 'react'
import { KeyInfoState } from './KeyInfo.state'
import { KeyInfoDialog } from './KeyInfoDialog'

export const KeyInfoProvider: StatelessComponent = props => {
  return (
    <KeyInfoState.Provider>
      <KeyInfoDialog />
      {props.children}
    </KeyInfoState.Provider>
  )
}

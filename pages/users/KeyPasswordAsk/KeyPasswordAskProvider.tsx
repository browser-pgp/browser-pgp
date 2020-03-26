import { KeyPasswordAskState } from './KeyPasswordAsk.state'
import { KeyPasswordAskDialog } from './KeyPasswordAskDialog'
import { StatelessComponent } from 'react'
export const KeyPasswordAskProvider: StatelessComponent = props => {
  return (
    <KeyPasswordAskState.Provider>
      <KeyPasswordAskDialog />
      {props.children}
    </KeyPasswordAskState.Provider>
  )
}

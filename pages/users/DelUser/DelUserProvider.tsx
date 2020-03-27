import { DelUserState } from './DelUser.state'
import { DelUserDialog } from './DelUserDialog'
import { StatelessComponent } from 'react'

export const DelUserProvider: StatelessComponent = props => {
  return (
    <DelUserState.Provider>
      <DelUserDialog />
      {props.children}
    </DelUserState.Provider>
  )
}

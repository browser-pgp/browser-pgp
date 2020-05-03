import { QRScannerState } from './QRScanner.state'
import { QRScannerDialog } from './QRScannerDialog'
import { StatelessComponent } from 'react'

export const QRScannerProvider: StatelessComponent = (props) => {
  return (
    <QRScannerState.Provider>
      <QRScannerDialog />
      {props.children}
    </QRScannerState.Provider>
  )
}

import { useState } from 'react'
import QrScanner from 'qr-scanner'

export enum ScanStatus {
  Wait,
  Stop,
  Running,
}

const useQRScannerState = () => {
  return useState({
    open: false,
    cb: (() => 0) as (url?: string) => any,
    scanStatus: ScanStatus.Wait,
    q: null as QrScanner,
    link: '',
  })
}

import { createContainer } from 'unstated-next'
export const QRScannerState = createContainer(useQRScannerState)

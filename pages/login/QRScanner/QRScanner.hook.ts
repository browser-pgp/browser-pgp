import { QRScannerState, ScanStatus } from './QRScanner.state'
export { ScanStatus }

export const useQRScanner = () => {
  const [state, setState] = QRScannerState.useContainer()

  const open = () =>
    new Promise<string>((rl) => {
      setState((s) => ({
        ...s,
        open: true,
        cb: rl,
      }))
    })
  const close = (link?: string) => {
    setState((s) => ({ ...s, open: false }))
    setState((s) => (s.cb(link), s))
  }
  const setScanStatus = (scanStatus: ScanStatus, link = '') => {
    setState((s) => ({ ...s, scanStatus }))
  }

  const startScan = () => {
    if (!state.q) {
      return
    }
    state.q.start().then(() => {
      setState((s) => ({ ...s, scanStatus: ScanStatus.Running }))
    })
  }

  const stopScan = (link?: string) => {
    setState((s) => ({
      ...s,
      link: !!link ? link : s.link,
      scanStatus: ScanStatus.Stop,
    }))
    if (state.q) {
      state.q.stop()
    }
  }

  return {
    state,
    setState,
    open,
    close,
    setScanStatus,
    startScan,
    stopScan,
  }
}

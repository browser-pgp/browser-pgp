import { useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'
QrScanner.WORKER_PATH = 'js-worker/qr-scanner-worker.min.js'
import { useQRScanner } from './QRScanner.hook'

export const QRScanner = () => {
  const v = useRef()
  const { setScanStatus, setState, stopScan } = useQRScanner()
  useEffect(() => {
    let q = new QrScanner(v.current, (result: string) => {
      if (result.startsWith('web+pgpauth:')) {
        stopScan(result)
      }
    })
    setState((s) => ({ ...s, q }))
    return () => {
      setState((s) => {
        if (s.q) {
          s.q.destroy()
        }
        return { ...s, q: null }
      })
    }
  }, [])
  return (
    <video
      ref={v}
      muted
      playsInline
      style={{ width: '100%', height: '100%' }}
    />
  )
}

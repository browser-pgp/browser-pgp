import { Button } from '@material-ui/core'
import { useQRScanner } from './QRScanner'
import { useRouter } from 'next/router'
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak'

export const QRScannerBtn = (props) => {
  const scanner = useQRScanner()
  const router = useRouter()
  const handleClick = async () => {
    let s = await scanner.open()
    if (!s) {
      return
    }
    router.replace({
      ...router,
      query: { url: s },
    })
  }
  return (
    <Button
      {...props}
      startIcon={<CenterFocusWeakIcon />}
      onClick={handleClick}
    >
      扫描
    </Button>
  )
}

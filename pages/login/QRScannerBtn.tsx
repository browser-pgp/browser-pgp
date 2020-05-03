import { Button } from '@material-ui/core'
import { useQRScanner } from './QRScanner'
import { useRouter } from 'next/router'
export const QRScannerBtn = (props) => {
  const scanner = useQRScanner()
  const router = useRouter()
  const handleClick = async () => {
    let s = await scanner.open()
    router.replace({
      ...router,
      query: { url: s },
    })
  }
  return (
    <Button {...props} onClick={handleClick}>
      扫描二维码
    </Button>
  )
}

import { Button, Tooltip } from '@material-ui/core'
import { useRouter } from 'next/router'

export const InputPGPAuthUrlBtn = (props) => {
  const router = useRouter()
  const handleInput = () => {
    let s = window.prompt('输入 web+pgpauth 链接')
    if (!s) {
      return
    }
    if (s.startsWith('web+pgpauth:') === false) {
      return
    }
    router.replace({
      ...router,
      query: { url: s },
    })
  }
  return (
    <Tooltip title="粘贴 web+pgpauth:login 开头的认证链接" placement="top">
      <Button {...props} onClick={handleInput}>
        粘贴链接
      </Button>
    </Tooltip>
  )
}

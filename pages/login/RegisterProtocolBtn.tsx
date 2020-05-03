import { Tooltip, Button } from '@material-ui/core'
import { useMemo, useState, forwardRef } from 'react'
import { normalizeHref } from '~pages/components/Link'

const Protocol = 'web+pgpauth'
const ProtocolHandler = normalizeHref('/login') + '?url=%s'

export const RegisterProtocolBtn = forwardRef((props, ref) => {
  const dealed = useMemo(() => {
    try {
      navigator.registerProtocolHandler(Protocol, ProtocolHandler, 'PGP Auth')
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }, [])
  const [registered, setRegistered] = useState(dealed)
  const registerProtocol = () => {
    try {
      navigator.registerProtocolHandler(Protocol, ProtocolHandler, 'PGP Auth')
      setRegistered(true)
    } catch (e) {}
  }
  const unregisterProtocol = () => {
    try {
      navigator.unregisterProtocolHandler(Protocol, ProtocolHandler)
      setRegistered(false)
    } catch (e) {}
  }
  if (registered === false) {
    return (
      <Tooltip
        ref={ref}
        title="设为打开 web+pgpauth 协议的默认应用"
        placement="top"
      >
        <Button {...props} onClick={registerProtocol}>
          注册应用
        </Button>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip ref={ref} title="不再响应 web+pgpauth 协议" placement="top">
        <Button {...props} onClick={unregisterProtocol}>
          取消注册
        </Button>
      </Tooltip>
    )
  }
})

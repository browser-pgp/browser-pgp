import { IconButton, Link, Tooltip } from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help'

export const IntrudctionIconLink = () => {
  return (
    <Link
      href="https://github.com/browser-pgp/browser-pgp#pgp-authencation-认证流程"
      target="pgp-web-auth-introduction"
    >
      <Tooltip title="PGP Auth 认证介绍 (新窗口打开)" placement="left">
        <IconButton>
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </Link>
  )
}

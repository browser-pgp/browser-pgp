import NextLink from 'next/link'
import { Link } from '@material-ui/core'
import { StatelessComponent, forwardRef } from 'react'

type Props = { href: string }

const WrapLink = forwardRef<any, Props>((props, ref) => {
  return (
    <NextLink href={props.href} ref={ref}>
      <Link {...props}>{props.children}</Link>
    </NextLink>
  )
})

export { WrapLink as Link }
export default WrapLink

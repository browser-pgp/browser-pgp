import NextLink from 'next/link'
import { Link } from '@material-ui/core'
import { StatelessComponent, forwardRef } from 'react'

type Props = { href: string }
const fakeBase = 'http://fake.start'

const normalizeHref = (href: string): string => {
  let u = new URL(href, fakeBase)
  if (u.pathname !== '/') {
    u.pathname = u.pathname + process.env.PATH_EXT_NAME
  }
  href = u.toString()
  href = href.replace(fakeBase, process.env.PATH_PREFIX)
  return href
}

const WrapLink = forwardRef<any, Props>((props, ref) => {
  let href = props.href
  if (process.env.NODE_ENV === 'production' && !!process.env.PATH_EXT_NAME) {
    href = normalizeHref(href)
  }
  return (
    <NextLink href={props.href} as={href} ref={ref}>
      <Link {...{ ...props, href }}>{props.children}</Link>
    </NextLink>
  )
})

export { WrapLink as Link }
export default WrapLink

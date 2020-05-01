import NextLink from 'next/link'
import { Link } from '@material-ui/core'
import { Component } from 'react'

const fakeBase = 'http://fake.start'

export const normalizeHref = (href: string): string => {
  let u = new URL(href, fakeBase)
  if (u.pathname !== '/') {
    u.pathname = u.pathname + process.env.PATH_EXT_NAME
  }
  href = u.toString()
  href = href.replace(fakeBase, process.env.PATH_PREFIX)
  return href
}

type Props = { href: string; [k: string]: any }

class WrapLink extends Component<Props> {
  private href: string
  constructor(props: Props, ctx) {
    super(props, ctx)
    let href = props.href
    if (process.env.NODE_ENV === 'production' && !!process.env.PATH_EXT_NAME) {
      href = normalizeHref(href)
    }
    this.href = href
  }
  render() {
    const { props, href } = this
    return (
      <NextLink href={props.href} as={href}>
        <Link {...{ ...props, href }}>{props.children}</Link>
      </NextLink>
    )
  }
}

export { WrapLink as Link }
export default WrapLink

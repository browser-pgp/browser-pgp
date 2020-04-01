import { Fragment } from 'react'
import Head from 'next/head'

import Dashboard from './Dashboard'

export const MainLayout: React.StatelessComponent<{
  title: string
}> = props => {
  return (
    <Fragment>
      <Head>
        <title>{props.title} PGP in Browser</title>
      </Head>
      <Dashboard>{props.children}</Dashboard>
    </Fragment>
  )
}

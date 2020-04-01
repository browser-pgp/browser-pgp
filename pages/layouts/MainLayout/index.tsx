import { Fragment } from 'react'
import Head from 'next/head'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import Dashboard from './Dashboard'

const useStyles = makeStyles(theme => ({
  croot: {
    height: '100%',
    padding: theme.spacing(3, 0),
  },
}))

export const MainLayout: React.StatelessComponent<{
  title: string
  inContainer?: boolean
}> = props => {
  const classes = useStyles()
  return (
    <Fragment>
      <Head>
        <title>{props.title} PGP in Browser</title>
      </Head>
      <Dashboard>
        {props.inContainer ? (
          <Container className={classes.croot}>{props.children}</Container>
        ) : (
          props.children
        )}
      </Dashboard>
    </Fragment>
  )
}

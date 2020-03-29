import { Container, Grid } from '@material-ui/core'
import { TopBar } from './TopBar'
import { Fragment } from 'react'
import Head from 'next/head'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
}))

export const MainLayout: React.StatelessComponent<{
  title: string
}> = props => {
  const classes = useStyles()
  return (
    <Fragment>
      <Head>
        <title>{props.title} PGP in Browser</title>
      </Head>
      <TopBar />
      <Container className={classes.main}>{props.children}</Container>
    </Fragment>
  )
}

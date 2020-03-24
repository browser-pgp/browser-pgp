import { Container, Grid } from '@material-ui/core'
import { TopBar } from './TopBar'
import { Fragment } from 'react'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
}))

export const MainLayout: React.StatelessComponent = props => {
  const classes = useStyles()
  return (
    <Fragment>
      <TopBar />
      <Container className={classes.main}>{props.children}</Container>
    </Fragment>
  )
}

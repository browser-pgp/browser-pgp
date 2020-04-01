import React, { useState, StatelessComponent, Fragment } from 'react'
import { makeStyles } from '@material-ui/core'
import NavBar from './NavBar'
import TopBar from './TopBar'

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    '@media all and (-ms-high-contrast:none)': {
      height: 0, // IE11 fix
    },
  },
  content: {
    paddingTop: 64,
    flexGrow: 1,
    maxWidth: '100%',
    overflowX: 'hidden',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256,
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 56,
    },
  },
}))

const Dashboard: StatelessComponent = props => {
  const classes = useStyles()
  const [openNavBarMobile, setOpenNavBarMobile] = useState(false)

  return (
    <Fragment>
      <TopBar onOpenNavBarMobile={() => setOpenNavBarMobile(true)} />
      <NavBar
        onMobileClose={() => setOpenNavBarMobile(false)}
        openMobile={openNavBarMobile}
      />
      <div className={classes.container}>
        <div className={classes.content}>{props.children}</div>
      </div>
    </Fragment>
  )
}

export default Dashboard

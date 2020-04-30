/* eslint-disable react/no-multi-comp */
import React, { useEffect, StatelessComponent, Fragment } from 'react'
import { Link } from '~pages/components/Link'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import { Drawer, Hidden, Tabs, Tab } from '@material-ui/core'
import { useRouter } from 'next/router'

const Nav = (displayName: string, path: string) => ({ displayName, path })
const navs = [
  Nav('编辑器', '/'),
  Nav('联系人', '/users'),
  Nav('远程同步', '/remote-sync'),
  Nav('登录第三方应用', '/login'),
]

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  navigation: {
    overflow: 'auto',
    padding: theme.spacing(2),
    flexGrow: 1,
  },
}))

export const NavBar: StatelessComponent<{
  onMobileClose: () => any
  openMobile: boolean
  className?: string
}> = ({ openMobile, onMobileClose, className, ...rest }) => {
  const classes = useStyles()
  const router = useRouter()

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose()
    }

    // eslint-disable-next-line
  }, [location.pathname])

  const content = (
    <div {...rest} className={clsx(classes.root, className)}>
      <nav className={classes.navigation}>
        <Tabs
          value={router.pathname}
          orientation="vertical"
          indicatorColor="primary"
        >
          {navs.map(nav => (
            <Tab
              key={nav.path}
              label={nav.displayName}
              value={nav.path}
              component={Link}
              href={nav.path}
            />
          ))}
        </Tabs>
      </nav>
    </div>
  )

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{
            paper: classes.mobileDrawer,
          }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{
            paper: classes.desktopDrawer,
          }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </Fragment>
  )
}

export default NavBar

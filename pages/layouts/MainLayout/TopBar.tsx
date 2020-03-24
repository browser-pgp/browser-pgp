import { AppBar, Toolbar, Typography, Tab, Tabs } from '@material-ui/core'
import { Fragment } from 'react'
import { Link } from '~pages/components/Link'
import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  tabs: {
    paddingLeft: theme.spacing(5),
  },
}))

const Nav = (displayName: string, path: string) => ({ displayName, path })
const navs = [Nav('联系人', '/'), Nav('编辑器', '/editor')]

export const TopBar = () => {
  const classes = useStyles()
  const router = useRouter()
  return (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">PGP in Browser</Typography>
          <Tabs value={router.pathname} className={classes.tabs}>
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
        </Toolbar>
      </AppBar>
    </Fragment>
  )
}

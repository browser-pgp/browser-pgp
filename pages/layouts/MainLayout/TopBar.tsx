import {
  AppBar,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Link as MLink,
  Button,
} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { Fragment } from 'react'
import { Link } from '~pages/components/Link'
import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  tabs: {
    paddingLeft: theme.spacing(5),
    flexGrow: 1,
  },
}))

const Nav = (displayName: string, path: string) => ({ displayName, path })
const navs = [
  Nav('联系人', '/'),
  Nav('编辑器', '/editor'),
  Nav('远程同步', '/remote-sync'),
]

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
          <Tooltip title="去 Github Issue 反馈问题和需求" placement="left">
            <MLink
              href="https://github.com/browser-pgp/browser-pgp/issues"
              color="inherit"
              target="github-browser-pgp"
            >
              <Button startIcon={<OpenInNewIcon />} color="inherit">
                反馈
              </Button>
            </MLink>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Fragment>
  )
}

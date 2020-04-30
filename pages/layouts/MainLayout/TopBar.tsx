import React, { StatelessComponent } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import {
  AppBar,
  IconButton,
  Toolbar,
  Hidden,
  colors,
  AppBarProps,
  Typography,
  Tooltip,
  Link as MLink,
  Button,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { Link } from '~pages/components/Link'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  trialButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900],
    },
  },
  trialIcon: {
    marginRight: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
}))

export const TopBar: StatelessComponent<{
  onOpenNavBarMobile: () => any
} & AppBarProps> = ({ onOpenNavBarMobile, className, ...rest }) => {
  const classes = useStyles()

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color="primary">
      <Toolbar>
        <Hidden lgUp>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            onClick={onOpenNavBarMobile}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6">
          <Link href="/" color="inherit">
            PGP in Browser
          </Link>
        </Typography>
        <div className={classes.flexGrow} />
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
  )
}

export default TopBar

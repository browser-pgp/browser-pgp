import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Slide,
  ButtonGroup,
} from '@material-ui/core'
import { useQRScanner, ScanStatus } from './QRScanner.hook'
import { QRScanner } from './QRScanner'
import clsx from 'clsx'
import CloseIcon from '@material-ui/icons/Close'
import { forwardRef, useEffect } from 'react'

import { ScanAnimationBox } from './ScanAnimationBox'
import { ShowLink } from './ShowLink'
const SwithDisplay = () => {
  const { state, startScan } = useQRScanner()
  switch (state.scanStatus) {
    case ScanStatus.Running:
      return <ScanAnimationBox />
    case ScanStatus.Wait:
      return <div>wait</div>
    case ScanStatus.Stop:
      return state.link ? (
        <ShowLink />
      ) : (
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={startScan}
        >
          开始扫描
        </Button>
      )
  }
}

const Transition = forwardRef((props, ref) => {
  // @ts-ignore
  return <Slide direction="up" ref={ref} {...props} />
})

import { makeStyles, colors } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  over: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    transition: '0.7s',
  },
  video: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  main: {
    // background: theme.palette.background.default,
    transition: '1s',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    padding: 0,
  },
  scanRuning: {
    backgroundColor: 'unset',
  },
}))

export const QRScannerDialog = () => {
  const { close, state, startScan, stopScan } = useQRScanner()
  const classes = useStyles()

  useEffect(() => {
    startScan()
  }, [state.q])

  return (
    <Dialog
      open={state.open}
      onClose={close}
      fullScreen
      // @ts-ignore
      TransitionComponent={Transition}
      className={classes.root}
    >
      <div className={classes.video}>
        <QRScanner />
      </div>
      <DialogTitle className={classes.over}>
        <Grid container justify="space-between">
          <Grid item>扫描二维码</Grid>
          <Grid item style={{ lineHeight: 0 }}>
            <IconButton color="inherit" size="small" onClick={() => close()}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent
        className={clsx(
          classes.over,
          classes.main,
          state.scanStatus === ScanStatus.Running && classes.scanRuning,
        )}
      >
        <Grid
          container
          style={{ height: '100%' }}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <SwithDisplay />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.over}>
        {state.scanStatus === ScanStatus.Running && (
          <Button color="inherit" onClick={() => stopScan()}>
            停止
          </Button>
        )}
        <Button color="inherit" onClick={() => close()}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  )
}

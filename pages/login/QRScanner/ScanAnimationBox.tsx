import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  box: {
    width: '70vw',
    height: '50vh',
  },
  line: {
    height: 3,
    backgroundColor: theme.palette.primary.main,
    opacity: '0.7',
    animation: '$loop-run infinite',
    animationDirection: 'alternate',
    animationTimingFunction: 'linear',
    animationDuration: '2s',
  },
  '@keyframes loop-run': {
    from: {
      transform: 'translateY(0vh)',
    },
    to: {
      transform: 'translateY(50vh)',
    },
  },
}))

export const ScanAnimationBox = () => {
  const classes = useStyles()
  return (
    <div className={classes.box}>
      <div className={classes.line} />
    </div>
  )
}

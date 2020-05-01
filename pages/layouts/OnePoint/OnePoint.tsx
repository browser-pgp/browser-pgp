import { StatelessComponent } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
}))

export const OnePoint: StatelessComponent<{ center?: boolean }> = (props) => {
  const classes = useStyles()
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      {...(props.center ? { justify: 'center' } : {})}
    >
      <Grid item>{props.children}</Grid>
    </Grid>
  )
}

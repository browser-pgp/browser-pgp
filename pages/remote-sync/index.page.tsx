import { MainLayout } from '~pages/layouts'
import {
  List,
  ListItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import { SyncForm } from './sync-form'
import { SyncStatusDisplay } from './sync-status'

export const Config = () => {
  return (
    <List>
      <SyncStatusDisplay />
      <ListItem>
        <SyncForm />
      </ListItem>
      {/* <ListItem>
        <ListItemText secondary="打开后会在浏览时自动同步">
          实时同步
        </ListItemText>
        <ListItemSecondaryAction>
          <Switch color="primary" />
        </ListItemSecondaryAction>
      </ListItem> */}
    </List>
  )
}

import { SyncState } from './sync.state'

export default () => {
  return (
    <SyncState.Provider>
      <MainLayout title="远程同步" inContainer>
        <div>
          <Grid container justify="center" spacing={2}>
            <Grid item lg={10} md={10} xl={8} xs={12}>
              <Card>
                <CardHeader title="远程同步设置" subheader="" />
                <CardContent style={{ paddingTop: 0 }}>
                  <Config />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </MainLayout>
    </SyncState.Provider>
  )
}

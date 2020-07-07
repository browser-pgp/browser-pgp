import { MainLayout } from '~pages/layouts'
import {
  List,
  ListItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
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

export default function Page() {
  return (
    <SyncState.Provider>
      <MainLayout title="远程同步" inContainer>
        <Card>
          <CardHeader title="远程同步设置" subheader="" />
          <CardContent style={{ paddingTop: 0 }}>
            <Grid container spacing={2}>
              <Grid item lg={8} md={8} xl={8} xs={12}>
                <Config />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </MainLayout>
    </SyncState.Provider>
  )
}

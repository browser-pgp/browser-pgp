import MUIDatatables from 'mui-datatables'
import { createTableOptions, Col } from '~modules/utils/mui-table'
import { PGPUserDucment } from '~modules/pgp-user'
import { myDatabase } from '~libs/db'
import { useObservable } from 'rxjs-hooks'
import { Fragment, StatelessComponent, useState, useMemo } from 'react'
import { LinearProgress, Button, makeStyles, useTheme } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import { useKeysSelect } from './KeysSelect.hook'
import { KeyType } from './KeysSelect.state'

const CustomToolbarSelect = (props: { onFinish: () => any }) => {
  const theme = useTheme()
  return (
    <div style={{ paddingLeft: theme.spacing(2) }}>
      <Button
        startIcon={<CheckIcon />}
        style={{ margin: '6px 0', lineHeight: '24px' }}
        onClick={() => props.onFinish()}
      >
        完成选择
      </Button>
    </div>
  )
}

const cols: Col<PGPUserDucment>[] = [
  new Col('名', u => u.name),
  new Col('邮箱', u => u.email),
  new Col('指纹', u => u.fingerprint),
]

const useStyles = makeStyles(theme => ({
  table: {
    '& .MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded': {
      flexDirection: 'row-reverse',
    },
    '& .MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded h6': {
      paddingRight: theme.spacing(3),
      paddingLeft: 0,
    },
  },
}))

export const KeysSelect: StatelessComponent<{ keyType: KeyType }> = props => {
  const ks = useKeysSelect()
  const classes = useStyles()
  const users = useObservable(() => {
    let q = myDatabase.users.find()
    if (props.keyType === KeyType.Private) {
      q = q.exists('privateKey')
    }
    return q.$
  })
  const displayData = (users || []).map(u => {
    return cols.map(col => col.opath(u))
  })
  // store selectedUsers like class attr
  const attr = useMemo<{ selectedUsers: PGPUserDucment[] }>(
    () => ({ selectedUsers: [] }),
    [],
  )

  const options = createTableOptions({
    customToolbarSelect: rows => {
      return (
        <CustomToolbarSelect onFinish={() => ks.close(attr.selectedUsers)} />
      )
    },
    selectableRowsOnClick: true,
    onRowsSelect: (curr, all: { dataIndex: number }[]) => {
      let selectedUsers = all.map(r => users[r.dataIndex])
      attr.selectedUsers = selectedUsers
      return all
    },
    // searchOpen: true,
  })

  let title: string
  switch (props.keyType) {
    case KeyType.Public:
      title = '选择加密公钥'
      break
    case KeyType.Private:
      title = '选择解密私钥'
      options.selectableRows = 'single'
      break
  }

  return (
    <Fragment>
      {users === null && <LinearProgress />}
      <div
        className={classes.table}
        onKeyPress={e => {
          if (e.key === 'Enter' && attr.selectedUsers.length > 0) {
            ks.close(attr.selectedUsers)
          }
        }}
      >
        <MUIDatatables
          title={title}
          columns={cols}
          data={displayData}
          options={options}
        />
      </div>
    </Fragment>
  )
}

import MUIDatatables, { MUIDataTableOptions } from 'mui-datatables'
import { createTableOptions, Col } from '~modules/utils/mui-table'
import { PGPUserDucment } from '~modules/pgp-user'
import { myDatabase } from '~libs/db'
import { useObservable } from 'rxjs-hooks'
import { Fragment, StatelessComponent, useCallback, useMemo } from 'react'
import { LinearProgress, Tooltip, IconButton, Button } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import { useKeysSelect } from './KeysSelect.hook'
import { KeyType } from './KeysSelect.state'

const CustomToolbarSelect = (props: {
  rows: number[]
  onFinish: (idx: number[]) => any
}) => {
  return (
    <Tooltip title="完成选择">
      <IconButton
        onClick={() => {
          props.onFinish(props.rows)
          return false
        }}
      >
        <CheckIcon />
      </IconButton>
    </Tooltip>
  )
}

const cols: Col<PGPUserDucment>[] = [
  new Col('名', u => u.name),
  new Col('邮箱', u => u.email),
  new Col('指纹', u => u.fingerprint),
]

export const KeysSelect: StatelessComponent<{ keyType: KeyType }> = props => {
  const users = useObservable(() => {
    let q = myDatabase.users.find()
    if (props.keyType === KeyType.Private) {
      q = q.where('privateKey').ne('')
    }
    return q.$
  })
  const displayData = (users || []).map(u => {
    return cols.map(col => col.opath(u))
  })

  const ks = useKeysSelect()
  const { title, privateKeyTypeOptions } = useMemo(() => {
    let title: string
    let privateKeyTypeOptions: MUIDataTableOptions = {}
    switch (props.keyType) {
      case KeyType.Public:
        title = '选择加密公钥'
        break
      case KeyType.Private:
        title = '选择解密私钥'
        privateKeyTypeOptions = {
          selectableRows: 'single',
        }
        break
    }
    return { title, privateKeyTypeOptions }
  }, [props.keyType])

  const options = createTableOptions({
    customToolbarSelect: rows => {
      return (
        <CustomToolbarSelect
          rows={rows.data.map(d => d.dataIndex)}
          onFinish={idx => ks.close(idx.map(i => users[i]))}
        />
      )
    },
    selectableRowsOnClick: true,
    // searchOpen: true,
  })

  return (
    <Fragment>
      {users === null && <LinearProgress />}
      <MUIDatatables
        title={title}
        columns={cols}
        data={displayData}
        options={{
          ...options,
          ...privateKeyTypeOptions,
        }}
      />
    </Fragment>
  )
}

import MUIDatatables from 'mui-datatables'
import { Fragment } from 'react'
import { createTableOptions, Col } from '~modules/utils/mui-table'
import { PGPUserDucment } from '~modules/pgp-user'
import { IconButton, Button, Checkbox } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useAddUser } from './AddUser'
import { DelUserBtn } from './DelUser'
import { KeyInfoBtn } from './KeyInfo'
import { useImportUser } from './ImportUser'

const cols: Col<PGPUserDucment>[] = [
  new Col('称呼', item => {
    return item.name
  }),
  new Col('邮箱', item => item.email),
  new Col('属性', item => item.publicKey, {
    searchable: false,
    filter: false,
    sort: false,
    customBodyRender: (pubKey: string) => {
      return <KeyInfoBtn pubKey={pubKey} />
    },
  }),
  new Col('私钥', item => !!item.privateKey, {
    searchable: false,
    filter: false,
    sort: false,
    customBodyRender(havePrivateKey) {
      return <Checkbox disabled color="primary" checked={havePrivateKey} />
    },
  }),
  new Col('更多', item => item.fingerprint, {
    filter: false,
    searchable: false,
    sort: false,
    customBodyRender: id => <DelUserBtn id={id} />,
  }),
]

const CustomToolbar = () => {
  const add = useAddUser()
  const iu = useImportUser()
  return (
    <Fragment>
      <IconButton onClick={() => add.open()}>
        <AddIcon />
      </IconButton>
      <Button onClick={() => iu.open()}>导入公钥</Button>
    </Fragment>
  )
}

const options = createTableOptions({
  customToolbar: () => {
    return <CustomToolbar />
  },
  selectableRows: 'none',
})

export const UserList: React.StatelessComponent<{
  users: PGPUserDucment[]
}> = ({ users }) => {
  const displayData = users.map(u => {
    return cols.map(col => col.opath(u))
  })
  return (
    <MUIDatatables
      title="联系人列表"
      data={displayData}
      columns={cols}
      options={options}
    />
  )
}

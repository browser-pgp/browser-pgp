import { Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { DisplayKeyInfo } from './KeyInfo.state'
import { util } from 'openpgp'

import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles(theme => ({
  keyId: {
    textTransform: 'uppercase',
  },
  fingerprint: {
    textTransform: 'uppercase',
  },
}))

export const KeyInfo = ({ data }: { data: DisplayKeyInfo }) => {
  const classes = useStyles()
  return (
    <Table style={{ wordBreak: 'keep-all' }}>
      <TableBody>
        <TableRow>
          <TableCell>用户ID</TableCell>
          <TableCell>
            {util.formatUserId({
              name: data.userId.name,
              email: data.userId.email,
              comment: '',
            })}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>注释</TableCell>
          <TableCell>{data.userId.comment}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>密钥ID</TableCell>
          <TableCell className={classes.keyId}>{data.keyId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>创建时间</TableCell>
          <TableCell>{data.createAt}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>过期时间</TableCell>
          <TableCell>{data.expireAt}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>指纹</TableCell>
          <TableCell className={classes.fingerprint}>
            {data.fingerprint}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

import * as openpgp from 'openpgp'
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core'
import { DisplayKeyInfo } from './KeyInfo.state'

export const KeyInfo = ({ data }: { data: DisplayKeyInfo }) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>用户</TableCell>
          <TableCell>{data.userId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>密钥ID</TableCell>
          <TableCell>{data.keyId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>注释</TableCell>
          <TableCell>{data.comment}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>创建时间</TableCell>
          <TableCell>{data.createAt}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>过期时间</TableCell>
          <TableCell>{data.expireAt}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

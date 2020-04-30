import { Button } from '@material-ui/core'
import { useDelUser } from '../DelUser'
import { useImportUser } from './ImportUser.hook'

export const DelUserBtn = () => {
  const del = useDelUser()
  const u = useImportUser()
  return (
    <Button
      style={{ float: 'right' }}
      onClick={() =>
        del.open(u.state.id as string).then((deleted) => deleted && u.close())
      }
    >
      删除
    </Button>
  )
}

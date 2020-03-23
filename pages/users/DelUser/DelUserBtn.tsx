import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDelUser } from './DelUser.hook'

export const DelUserBtn: React.StatelessComponent<{ id: string }> = props => {
  const del = useDelUser()
  return (
    <IconButton onClick={() => del.open(props.id)}>
      <DeleteIcon />
    </IconButton>
  )
}

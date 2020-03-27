import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { useImportUser } from './ImportUser'

export const EditButton = (props: { id: string }) => {
  const u = useImportUser()
  return (
    <IconButton onClick={() => u.open(props.id)}>
      <EditIcon />
    </IconButton>
  )
}

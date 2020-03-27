import { Menu, MenuItem, IconButton } from '@material-ui/core'
import { Fragment, useRef, useState } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

export const EditButton = (props: { id: string }) => {
  const ref = useRef()
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <IconButton ref={ref} onClick={() => setOpen(true)}>
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={ref.current} open={open} onClose={() => setOpen(false)}>
        <MenuItem onClick={() => setOpen(false)}>编辑</MenuItem>
        <MenuItem onClick={() => setOpen(false)}>删除</MenuItem>
      </Menu>
    </Fragment>
  )
}

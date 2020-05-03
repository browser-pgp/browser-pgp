import {
  Typography,
  List,
  ListItem,
  Button,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Divider,
  IconButton,
} from '@material-ui/core'
import { useQRScanner } from './QRScanner.hook'
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak'
import { useMemo } from 'react'

export const ShowLink = () => {
  const { state, close, startScan } = useQRScanner()
  const j = useMemo(() => {
    if (!state.link) {
      return null
    }
    let u = new URL(state.link)
    let au = new URL(u.searchParams.get('auth'))
    return {
      auth: au.origin,
      fingerprint: u.searchParams.get('fingerprint'),
      mid: u.searchParams.get('mid'),
    }
  }, [state.link])
  let haction = (
    <Button size="large" onClick={startScan} endIcon={<CenterFocusWeakIcon />}>
      重新扫描
    </Button>
  )
  return (
    <Container maxWidth="sm" style={{ width: '100vw' }}>
      <Card>
        <CardHeader title="扫描结果" action={haction} />
        <Divider />
        <div style={{ overflow: 'auto' }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>auth</TableCell>
                <TableCell>{j.auth}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>fingerprint</TableCell>
                <TableCell>{j.fingerprint}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>mid</TableCell>
                <TableCell>{j.mid}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <CardActions>
          <Button
            fullWidth
            onClick={() => close(state.link)}
            variant="contained"
            size="large"
            color="primary"
          >
            点击应用
          </Button>
        </CardActions>
      </Card>
    </Container>
  )
}

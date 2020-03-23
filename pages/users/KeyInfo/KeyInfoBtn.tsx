import { useKeyInfo } from './KeyInfo.hook'
import { Button } from '@material-ui/core'

export const KeyInfoBtn: React.StatelessComponent<{
  pubKey: string
}> = props => {
  const info = useKeyInfo()
  return <Button onClick={() => info.open(props.pubKey)}>查看公钥属性</Button>
}

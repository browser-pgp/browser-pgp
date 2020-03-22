import { OpenPGPState } from './openpgp.state'
import * as openpgp from 'openpgp'
import { getStoreKeys } from './utils'

export const useOpenPGP = () => {
  const [state, setState] = OpenPGPState.useContainer()

  const decrypt = async (msg: string) => {}
  const encrypt = async (msg: string) => {
    openpgp.encrypt({
      message: openpgp.message.fromText(msg),
      privateKeys: [],
    })
  }
  const sign = async (msg: string) => {}

  const decryptPrivateKey = async (pass: string) => {
    const { privateKey, publicKey } = await getStoreKeys()
    await privateKey.decrypt(pass)
    setState(s => ({
      ...s,
      privateKey: privateKey,
      publicKey: publicKey,
    }))
  }

  return {
    decrypt,
    encrypt,
    sign,
    decryptPrivateKey,
  }
}

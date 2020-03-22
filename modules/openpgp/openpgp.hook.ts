import { OpenPGPState } from './openpgp.state'
import * as openpgp from 'openpgp'
import { getStoreKeys } from './utils'

export const useOpenPGP = () => {
  const [state, setState] = OpenPGPState.useContainer()

  const decrypt = async (msg: string) => {
    let { data } = await openpgp.decrypt({
      message: await openpgp.message.readArmored(msg),
      privateKeys: [state.privateKey],
      publicKeys: [state.publicKey],
    })
    return data as string
  }
  const encrypt = async (msg: string) => {
    let { data } = await openpgp.encrypt({
      message: openpgp.message.fromText(msg),
      privateKeys: [state.privateKey],
      publicKeys: [state.publicKey],
    })
    return data
  }
  const sign = async (msg: string) => {
    let { data } = await openpgp.sign({
      message: openpgp.message.fromText(msg),
      privateKeys: [state.privateKey],
    })
    return data
  }

  const verify = async (msg: string) => {
    let { signatures } = await openpgp.verify({
      message: await openpgp.message.readArmored(msg),
      publicKeys: [state.publicKey],
    })
    if (!signatures[0].valid) {
      throw new Error('签名错误')
    }
    // @ts-ignore
    return signatures[0].keyid.toHex()
  }

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
    verify,
  }
}

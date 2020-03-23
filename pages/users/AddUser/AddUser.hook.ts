import { AddUserState } from './AddUser.state'
import openpgp from 'openpgp'
import { useSnackbar } from 'notistack'
import { myDatabase } from '~libs/db'

const CurveOption = (name: string) => ({ name, value: name })
export const CurveOptions = [
  CurveOption('rsa4096'),
  CurveOption('rsa2048'),
  CurveOption('curve25519'),
  CurveOption('p256'),
  CurveOption('p384'),
  CurveOption('p521'),
  CurveOption('secp256k1'),
  CurveOption('brainpoolP256r1'),
  CurveOption('brainpoolP384r1'),
  CurveOption('brainpoolP512r1'),
]

export type FormData = {
  curve: string
  name: string
  email: string
  pass: string
}

export const useAddUser = () => {
  const [state, setState] = AddUserState.useContainer()
  const { enqueueSnackbar } = useSnackbar()

  const open = () => {
    setState(s => ({ ...s, open: true }))
  }

  const close = () => {
    setState(s => ({ ...s, open: false }))
  }

  const add = async (data: FormData) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const res = await openpgp.generateKey({
          userIds: [{ name: data.name, email: data.email }],
          passphrase: data.pass,
          ...(data.curve.startsWith('rsa')
            ? { numBits: Number(data.curve.slice(-4)) }
            : { curve: data.curve }),
        })
        await myDatabase.users.insert({
          name: data.name,
          email: data.email,
          publicKey: res.publicKeyArmored,
          privateKey: res.privateKeyArmored,
          revocationCertificate: res.revocationCertificate,
        })
      })
      .then(
        () => {
          enqueueSnackbar(`生成用户密钥成功`)
          setState(s => ({ ...s, open: false }))
        },
        (err: Error) => {
          enqueueSnackbar(`生成用户密钥失败. 错误: ${err?.message}`)
          console.error(err)
        },
      )
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }
  return {
    state,
    setState,
    close,
    genUserKey: add,
    open,
  }
}

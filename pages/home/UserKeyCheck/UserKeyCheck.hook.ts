import { UserKeyCheckState } from './UserKeyCheck.state'
import { StoreName } from '~libs/browser/constants'
import localforage from 'localforage'
import openpgp from 'openpgp'
import { useSnackbar } from 'notistack'

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

export const useUserKeyCheck = () => {
  const [state, setState] = UserKeyCheckState.useContainer()
  const { enqueueSnackbar } = useSnackbar()

  const close = () => {
    setState(s => ({ ...s, open: false }))
  }

  const importUserKey = () => {}

  const genUserKey = async (data: FormData) => {
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
        await Promise.all([
          localforage.setItem(StoreName.PrivateKey, res.privateKeyArmored),
          localforage.setItem(StoreName.PubliceKey, res.publicKeyArmored),
          localforage.setItem(
            StoreName.RevocationCertificateKey,
            res.revocationCertificate,
          ),
        ])
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

  const getUserPubKey = async () => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const pubKey = await localforage.getItem<String>(StoreName.PubliceKey)
        const hasPubKey = typeof pubKey === 'string'
        setState(s => ({ ...s, hasPubKey: hasPubKey }))
      })
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  return {
    state,
    setState,
    close,
    getUserPubKey,
    genUserKey,
  }
}

import { HomeState } from './home.state'
import { useSnackbar } from 'notistack'
import { useOpenPGP } from '~modules/openpgp'
import { useStepNotification } from '~modules/utils/useStepNotification'

export const useHome = () => {
  const [state, setState] = HomeState.useContainer()
  const { enqueueSnackbar } = useSnackbar()
  const pgp = useOpenPGP()
  const encryptStepNotice = useStepNotification('加密')

  const encrypt = (msg: string) => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let dd = await pgp.encrypt(msg)
      })
      .then(...encryptStepNotice)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  return {
    state,
  }
}

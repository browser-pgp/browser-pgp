import { DelUserState } from './DelUser.state'
import { myDatabase } from '~libs/db'
import { useStepNotification } from '~modules/utils/useStepNotification'

export const useDelUser = () => {
  const [state, setState] = DelUserState.useContainer()
  const removeUserStepNotifications = useStepNotification('删除用户')

  const open = async (id: string) => {
    setState(s => ({ ...s, open: true, id }))
  }

  const remove = async () => {
    if (state.pending) {
      return
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        let doc = await myDatabase.users
          .findOne()
          .where('fingerprint')
          .eq(state.id)
          .exec()
        await doc.remove()
        setState(s => ({ ...s, open: false }))
      })
      .then(...removeUserStepNotifications)
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const close = () => {
    setState(s => ({ ...s, open: false }))
  }

  return {
    state,
    setState,
    open,
    close,
    remove,
  }
}

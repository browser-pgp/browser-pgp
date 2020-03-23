import { DelUserState } from './DelUser.state'

export const useDelUser = () => {
  const [state, setState] = DelUserState.useContainer()

  const open = (id: string) => {
    setState(s => ({ ...s, open: true, id }))
  }

  const close = () => {
    setState(s => ({ ...s, open: false }))
  }

  return {
    state,
    setState,
    open,
    close,
  }
}

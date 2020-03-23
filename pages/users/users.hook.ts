import { UsersState } from './users.state'

export const useUsers = () => {
  const [state, setState] = UsersState.useContainer()
  return {
    state,
    setState,
  }
}

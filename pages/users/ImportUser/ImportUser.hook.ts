import { ImportUserState } from './ImportUser.state'

export const useImportUser = () => {
  const [state, setState] = ImportUserState.useContainer()
  const close = () => {
    setState(s => ({ ...s, open: false }))
  }
  const open = () => {
    setState(s => ({ ...s, open: true }))
  }
  return {
    state,
    setState,
    close,
    open,
  }
}

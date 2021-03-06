import { EditorState } from './SimpleEditor.state'
import { SimpleEditor } from './SimpleEditor.class'

export const useSimpleEditor = () => {
  const [state, setState] = EditorState.useContainer()

  const init = (ref: HTMLElement, options: any = {}) => {
    let editor: any = new SimpleEditor(ref as any, options as any)
    setState(s => ({ ...s, editor }))
  }

  const destory = () => {}

  return { state, setState, init, destory }
}

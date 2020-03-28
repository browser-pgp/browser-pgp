import { EditorState } from './Editor.state'
import monaco from './MonacoEditor'

export const useEditor = () => {
  const [state, setState] = EditorState.useContainer()
  const init = (
    ref: HTMLElement,
    options: monaco.editor.IStandaloneEditorConstructionOptions = {},
  ) => {
    const editor = monaco.editor.create(ref, {
      fontSize: 16,
      tabSize: 2,
      wordWrap: 'on',
      ...options,
    })
    editor.focus()
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      // do nothing, just hook browser save
    })
    setState(s => ({ ...s, editor }))
  }
  const destory = () => {
    if (!state.editor) {
      return
    }
    state.editor.dispose()
    setState(s => ({ ...s, editor: null }))
  }
  return { state, setState, init, destory }
}

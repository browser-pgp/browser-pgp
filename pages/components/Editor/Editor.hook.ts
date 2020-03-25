import { EditorState } from './Editor.state'
import monaco from './MonacoEditor'

export const useEditor = () => {
  const [state, setState] = EditorState.useContainer()
  const init = (
    ref: HTMLElement,
    value = '',
    options: monaco.editor.IStandaloneEditorConstructionOptions = {},
  ) => {
    const model = monaco.editor.createModel(value)
    model.updateOptions({
      tabSize: 2,
    })
    const editor = monaco.editor.create(ref, {
      model,
      fontSize: 16,
      wordWrap: 'on',
      ...options,
    })
    editor.focus()
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      // do nothing, just hook browser save
    })
    setState(s => ({ ...s, editor }))
    return editor.getModel()
  }
  const destory = () => {
    if (!state.editor) {
      return
    }
    state.editor.dispose()
    state.editor.getModel().dispose()
    setState(s => ({ ...s, editor: null }))
  }
  return { state, setState, init, destory }
}

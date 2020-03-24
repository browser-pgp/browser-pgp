import { EditorState } from './Editor.state'
const monaco = process.browser
  ? (require('monaco-editor') as typeof import('monaco-editor'))
  : null

if (process.browser) {
  let originGetWorkerUrl = self['MonacoEnvironment'].getWorkerUrl
  self['MonacoEnvironment'].getWorkerUrl = function(...r) {
    let f: string = originGetWorkerUrl(...r)
    f = f.replace('../public/monaco-editor', '')
    console.log(f)
    return f
  }
}
export const useEditor = () => {
  const [state, setState] = EditorState.useContainer()
  const init = (ref: HTMLElement) => {
    const model = monaco.editor.createModel('')
    model.updateOptions({
      tabSize: 2,
    })
    const editor = monaco.editor.create(ref, {
      model,
      fontSize: 16,
      wordWrap: 'on',
    })
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      // do nothing, just hook browser save
    })
    setState(s => ({ ...s, editor, model }))
    return model
  }
  const destory = () => {
    if (!state.editor) {
      return
    }
    state.editor.dispose()
    state.model.dispose()
    setState(s => ({ ...s, editor: null, model: null }))
  }
  return { state, setState, init, destory }
}

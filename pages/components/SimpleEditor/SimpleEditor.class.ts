import { editor } from 'monaco-editor'

export class SimpleEditor {
  private model: SimpleTextModel
  constructor(
    private textarea: HTMLTextAreaElement,
    options: editor.IStandaloneEditorConstructionOptions = {},
  ) {
    this.textarea.value = options.model.getValue()
  }
}
export class SimpleTextModel {}

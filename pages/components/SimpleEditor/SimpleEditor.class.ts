export interface ICodeEditorViewState {
  start: number
}

export interface SimpleEditorConstructionOptions {
  model?: SimpleTextModel
  fontSize?: number
  minimap?: any
}

export class SimpleEditor {
  private model: SimpleTextModel
  constructor(
    public textarea: HTMLTextAreaElement,
    options: SimpleEditorConstructionOptions = {},
  ) {
    this.textarea.addEventListener('input', e => {
      // @ts-ignore
      this.model.handleChangeContent(e.target.value)
    })

    let m = options.model || new SimpleTextModel('', this)
    this.setModel(m)
  }
  updateOptions(options: { readOnly?: boolean }) {
    if (typeof options.readOnly === 'boolean') {
      this.textarea.readOnly = options.readOnly
      this.textarea.disabled = options.readOnly
    }
  }
  getModel(): SimpleTextModel {
    return this.model
  }
  focus() {
    this.textarea.focus()
  }
  restoreViewState(state: ICodeEditorViewState) {
    this.textarea.setSelectionRange(state.start, state.start)
  }
  saveViewState(): ICodeEditorViewState {
    return {
      start: this.textarea.selectionStart,
    }
  }
  setModel(model: SimpleTextModel) {
    model.editor = this
    this.model = model
    model.setValue()
  }
  static createModel(value: '') {
    return new SimpleTextModel(value)
  }
}

export class SimpleTextModel {
  constructor(public value: string = '', public editor?: SimpleEditor) {}
  getValue(): string {
    return this.value
  }
  setValue(value: string = this.value) {
    this.value = value
    if (this.editor) {
      this.editor.textarea.value = value
    }
  }
  private listener: Array<(v: string) => any> = [
    (value: string) => {
      this.value = value
    },
  ]
  handleChangeContent(v: string) {
    this.listener.forEach(f => {
      f(v)
    })
  }
  onDidChangeContent(f: () => any) {
    this.listener.push(f)
  }
  dispose() {}
}

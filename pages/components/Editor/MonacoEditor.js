const monaco = process.browser ? require('monaco-editor') : null

if (process.browser) {
  // hook monaco editor loader
  if (self['MonacoEnvironment']) {
    let originGetWorkerUrl = self['MonacoEnvironment'].getWorkerUrl
    self['MonacoEnvironment'].getWorkerUrl = function(...r) {
      /**@type {string} */
      let f = originGetWorkerUrl(...r)
      f = f.replace('../public/monaco-editor/', '')
      return f
    }
  }
}

export default monaco

import './editor/monaco-setup'
import {registerSysmlv2Language} from "./editor/sysmlv2-language"
import {Sysmlv2Editor} from './editor/sysmlv2-editor'
import {SAMPLE_SYSML} from './editor/sample-model'

function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('editor-pane')
    if (!container) throw new Error('#editor-pane not found')

    registerSysmlv2Language()
    const editor = new Sysmlv2Editor(container, SAMPLE_SYSML)
    editor.onChangeText((text) => console.log(`text changed (${text.length} chars)`))

    // Temporary: proves the error-marker path works before Langium exists.
    editor.setDiagnostics([{
      message: 'Demo error marker',
      severity: 'error',
      startLine: 3,
      startColumn: 5,
      endLine: 3,
      endColumn: 5,
    }])
  })
}

init()

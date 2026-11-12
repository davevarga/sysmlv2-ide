import './editor/monaco-setup'
import { Sysmlv2LanguageService } from '@sysmlv2-ide/language'
import { DiagnosticsController } from './editor/diagnostics-controller'
import { SAMPLE_SYSMLv2 } from './editor/sample-model'
import { Sysmlv2Editor } from './editor/sysmlv2-editor'
import { registerSysmlv2Language } from './editor/sysmlv2-language'

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('editor-pane')
  if (!container) throw new Error('#editor-pane not found')

  registerSysmlv2Language()
  const editor = new Sysmlv2Editor(container, SAMPLE_SYSMLv2)
  new DiagnosticsController(new Sysmlv2LanguageService(), editor).start()
})

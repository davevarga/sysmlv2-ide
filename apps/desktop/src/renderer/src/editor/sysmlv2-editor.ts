import * as monaco from 'monaco-editor'
import { SYSMLV2_LANGUAGE_ID } from './sysmlv2-language'
import { type Sysmlv2Diagnostic } from './sysmlv2-diagnostic'
import { RichDiagnosticHover } from './diagnostic-hover'

const SEVERITY = {
  error: monaco.MarkerSeverity.Error,
  warning: monaco.MarkerSeverity.Warning,
  info: monaco.MarkerSeverity.Info
} as const

const MARKER_OWNER = 'sysmlv2'

export class Sysmlv2Editor {
  private readonly model: monaco.editor.ITextModel
  private readonly editor: monaco.editor.IStandaloneCodeEditor
  private readonly hover: RichDiagnosticHover

  constructor(container: HTMLElement, initialText: string) {
    this.model = monaco.editor.createModel(
      initialText,
      SYSMLV2_LANGUAGE_ID,
      monaco.Uri.parse('inmemory://model/main.sysmlv2')
    )
    this.editor = monaco.editor.create(container, {
      model: this.model,
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false
    })
    this.hover = new RichDiagnosticHover(this.model)
  }

  getText(): string {
    return this.model.getValue()
  }

  /** Port 1: tell the outside world the text changed (the parser will listen here). */
  onChangeText(listener: (text: string) => void): monaco.IDisposable {
    return this.model.onDidChangeContent(() => listener(this.model.getValue()))
  }

  setDiagnostics(diagnostics: Sysmlv2Diagnostic[]): void {
    const markers = diagnostics.map((d) => ({
      message: d.message,
      severity: SEVERITY[d.severity],
      startLineNumber: d.startLine,
      startColumn: d.startColumn,
      endLineNumber: d.endLine,
      endColumn: d.endColumn
    }))
    monaco.editor.setModelMarkers(this.model, MARKER_OWNER, markers)
    this.hover.update(diagnostics)
  }

  dispose(): void {
    this.editor.dispose()
    this.model.dispose()
    this.hover.dispose()
  }
}

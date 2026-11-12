import type { DiagnosticsView } from '@renderer/editor/diagnostics-controller'
import type { Sysmlv2Diagnostic } from '@renderer/editor/sysmlv2-diagnostic'

/** Stands in for the Monaco editor: records what the controller shows. */
export class FakeDiagnosticsView implements DiagnosticsView {
  readonly shown: Sysmlv2Diagnostic[][] = []
  private listener: ((text: string) => void) | undefined

  constructor(private text: string) {}

  getText(): string {
    return this.text
  }

  onChangeText(listener: (text: string) => void): { dispose(): void } {
    this.listener = listener
    return { dispose: () => (this.listener = undefined) }
  }

  setDiagnostics(diagnostics: Sysmlv2Diagnostic[]): void {
    this.shown.push(diagnostics)
  }

  /** Simulates the user typing. */
  type(text: string): void {
    this.text = text
    this.listener?.(text)
  }
}

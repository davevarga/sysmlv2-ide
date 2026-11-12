import type { LanguageDiagnostic } from '@sysmlv2-ide/language'
import { toEditorDiagnostic } from './diagnostic-mapper'
import type { Sysmlv2Diagnostic } from './sysmlv2-diagnostic'

/** What the UI needs from the language backend. Sysmlv2LanguageService satisfies it as is. */
export interface DiagnosticsSource {
  analyze(text: string): Promise<{ diagnostics: LanguageDiagnostic[] }>
}

/** What the controller needs from the editor. Sysmlv2Editor satisfies it as is. */
export interface DiagnosticsView {
  getText(): string
  onChangeText(listener: (text: string) => void): { dispose(): void }
  setDiagnostics(diagnostics: Sysmlv2Diagnostic[]): void
}

const DEFAULT_DEBOUNCE_MS = 300

export class DiagnosticsController {
  private version = 0
  private timer: ReturnType<typeof setTimeout> | undefined
  private subscription: { dispose(): void } | undefined

  constructor(
    private readonly source: DiagnosticsSource,
    private readonly view: DiagnosticsView,
    private readonly debounceMs = DEFAULT_DEBOUNCE_MS
  ) {}

  start(): void {
    this.subscription = this.view.onChangeText((text) => this.schedule(text))
    void this.analyze(this.view.getText())
  }

  dispose(): void {
    clearTimeout(this.timer)
    this.subscription?.dispose()
    this.version++ // invalidates any analysis still in flight
  }

  private schedule(text: string): void {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => void this.analyze(text), this.debounceMs)
  }

  private async analyze(text: string): Promise<void> {
    const current = ++this.version
    try {
      const { diagnostics } = await this.source.analyze(text)
      if (current !== this.version) return // a newer edit exists: drop this stale result
      this.view.setDiagnostics(diagnostics.map(toEditorDiagnostic))
    } catch (error) {
      console.error('Language analysis failed', error)
    }
  }
}

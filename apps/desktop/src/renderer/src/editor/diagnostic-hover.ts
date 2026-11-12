import * as monaco from 'monaco-editor'
import { SYSMLV2_LANGUAGE_ID } from './sysmlv2-language'
import type { Sysmlv2Diagnostic } from './sysmlv2-diagnostic'

/** Markers can only show plain text, so rich (markdown) messages go through a hover provider. */
export class RichDiagnosticHover implements monaco.IDisposable {
  private diagnostics: readonly Sysmlv2Diagnostic[] = []
  private readonly registration: monaco.IDisposable

  constructor(private readonly model: monaco.editor.ITextModel) {
    this.registration = monaco.languages.registerHoverProvider(SYSMLV2_LANGUAGE_ID, {
      provideHover: (hoveredModel, position) => this.provide(hoveredModel, position)
    })
  }

  update(diagnostics: readonly Sysmlv2Diagnostic[]): void {
    this.diagnostics = diagnostics
  }

  dispose(): void {
    this.registration.dispose()
  }

  private provide(
    hoveredModel: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.Hover | null {
    if (hoveredModel !== this.model) return null
    const hits = this.diagnostics.filter(
      (d) =>
        d.markdown !== undefined &&
        new monaco.Range(d.startLine, d.startColumn, d.endLine, d.endColumn).containsPosition(
          position
        )
    )
    const first = hits[0]
    if (!first) return null
    return {
      range: new monaco.Range(first.startLine, first.startColumn, first.endLine, first.endColumn),
      // Only `value`: isTrusted and supportHtml stay off, so Monaco sanitizes the markdown.
      contents: hits.map((d) => ({ value: d.markdown ?? '' }))
    }
  }
}

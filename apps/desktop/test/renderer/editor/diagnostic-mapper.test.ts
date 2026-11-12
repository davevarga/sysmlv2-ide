import { describe, expect, it } from 'vitest'
import { toEditorDiagnostic } from '@renderer/editor/diagnostic-mapper'
import { languageDiagnostic } from '../../support/language-diagnostics'

describe('toEditorDiagnostic', () => {
  it('converts 0-based language positions to 1-based Monaco positions', () => {
    const result = toEditorDiagnostic(
      languageDiagnostic({
        range: { startLine: 0, startCharacter: 4, endLine: 2, endCharacter: 9 }
      })
    )

    expect(result).toMatchObject({ startLine: 1, startColumn: 5, endLine: 3, endColumn: 10 })
  })

  it('shows hints as info', () => {
    expect(toEditorDiagnostic(languageDiagnostic({ severity: 'hint' })).severity).toBe('info')
  })

  it('keeps the other severities', () => {
    expect(toEditorDiagnostic(languageDiagnostic({ severity: 'warning' })).severity).toBe('warning')
  })

  it('gives a plain message no markdown', () => {
    const result = toEditorDiagnostic(languageDiagnostic())

    expect(result.message).toBe('boom')
    expect(result).not.toHaveProperty('markdown')
  })

  it('keeps a plain-text fallback and the markdown for a markdown message', () => {
    const result = toEditorDiagnostic(
      languageDiagnostic({ message: { kind: 'markdown', text: '**boom**' } })
    )

    expect(result.message).toBe('**boom**')
    expect(result.markdown).toBe('**boom**')
  })
})

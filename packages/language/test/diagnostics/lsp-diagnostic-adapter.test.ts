import { describe, expect, it } from 'vitest'
import { toLanguageDiagnostic } from '../../src/language/lsp-diagnostic-adapter.js'

const range = { start: { line: 0, character: 1 }, end: { line: 2, character: 3 } }

describe('toLanguageDiagnostic', () => {
  it('maps a plain string to a plain message', () => {
    expect(toLanguageDiagnostic({ range, message: 'boom' }).message).toEqual({
      kind: 'plain',
      text: 'boom'
    })
  })

  it('maps plaintext MarkupContent to a plain message', () => {
    const d = toLanguageDiagnostic({ range, message: { kind: 'plaintext', value: 'boom' } })
    expect(d.message).toEqual({ kind: 'plain', text: 'boom' })
  })

  it('maps markdown MarkupContent to a markdown message', () => {
    const d = toLanguageDiagnostic({ range, message: { kind: 'markdown', value: '**boom**' } })
    expect(d.message).toEqual({ kind: 'markdown', text: '**boom**' })
  })

  it('keeps severity and the 0-based range', () => {
    const d = toLanguageDiagnostic({ range, message: 'x', severity: 2 })
    expect(d.severity).toBe('warning')
    expect(d.range).toEqual({ startLine: 0, startCharacter: 1, endLine: 2, endCharacter: 3 })
  })
})

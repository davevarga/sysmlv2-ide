import { describe, expect, it } from 'vitest'
import { matchDiagnosticMessage } from '../../src/language/diagnostic.js'

describe('matchDiagnosticMessage', () => {
  const visitor = { plain: () => 'P', markdown: () => 'M' }

  it('dispatches on kind', () => {
    expect(matchDiagnosticMessage({ kind: 'plain', text: '' }, visitor)).toBe('P')
    expect(matchDiagnosticMessage({ kind: 'markdown', text: '' }, visitor)).toBe('M')
  })
})

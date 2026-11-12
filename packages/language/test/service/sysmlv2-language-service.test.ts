import { describe, expect, it } from 'vitest'
import { Sysmlv2LanguageService } from '../../src/index.js'

// Real Langium: the parser, linker and validator are NOT mocked here.
describe('Sysmlv2LanguageService', () => {
  const service = new Sysmlv2LanguageService()

  it('returns no diagnostics for valid text', async () => {
    const { diagnostics } = await service.analyze('package P { part def A; part a: A; }')
    expect(diagnostics).toEqual([])
  })

  it('reports a syntax error with a 0-based range', async () => {
    const { diagnostics } = await service.analyze('part def ;')
    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0]).toMatchObject({
      severity: 'error',
      range: { startLine: 0, startCharacter: 9 }
    })
  })

  it('reports unresolved references', async () => {
    const { diagnostics } = await service.analyze('part a : Missing;')
    expect(diagnostics[0]?.message.text).toContain('Missing')
  })

  it('survives overlapping calls', async () => {
    const [a, b] = await Promise.all([
      service.analyze('part def ;'),
      service.analyze('part def B;')
    ])
    expect(a.diagnostics).toHaveLength(1)
    expect(b.diagnostics).toHaveLength(0)
  })
})

import { describe, expect, it } from 'vitest'
import { parseHelper } from 'langium/test'
import {
  createSysMLv2Services,
  isPartDefinition,
  isPartUsage,
  type Model
} from '../../src/index.js'

// Real Langium: parser and linker are NOT mocked here.
const { SysMLv2 } = createSysMLv2Services()
const parse = parseHelper<Model>(SysMLv2)

describe('SysMLv2 minimal grammar', () => {
  it('parses a part def and a typed part usage with a resolved reference', async () => {
    const doc = await parse(
      `
      part def Engine;
      part engine : Engine;
    `,
      { validation: true }
    )

    expect(doc.parseResult.parserErrors).toHaveLength(0)
    expect(doc.diagnostics ?? []).toHaveLength(0)

    const [def, usage] = doc.parseResult.value.elements
    expect(isPartDefinition(def)).toBe(true)
    expect(isPartUsage(usage)).toBe(true)
    if (isPartUsage(usage)) {
      expect(usage.type?.ref?.name).toBe('Engine')
    }
  })

  it('reports a syntax error for incomplete input', async () => {
    const doc = await parse('part def ;')
    expect(doc.parseResult.parserErrors.length).toBeGreaterThan(0)
  })
})

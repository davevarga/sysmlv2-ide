import type { LanguageDiagnostic } from '@sysmlv2-ide/language'

/** A diagnostic as the language backend would return it (0-based range). */
export function languageDiagnostic(
  overrides: Partial<LanguageDiagnostic> = {}
): LanguageDiagnostic {
  return {
    message: { kind: 'plain', text: 'boom' },
    severity: 'error',
    range: { startLine: 0, startCharacter: 2, endLine: 0, endCharacter: 5 },
    ...overrides
  }
}

export function plainError(text: string): LanguageDiagnostic {
  return languageDiagnostic({ message: { kind: 'plain', text } })
}

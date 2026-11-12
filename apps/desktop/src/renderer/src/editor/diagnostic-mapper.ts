import { matchDiagnosticMessage, type LanguageDiagnostic } from '@sysmlv2-ide/language'
import { Sysmlv2Diagnostic } from './sysmlv2-diagnostic'

export function toEditorDiagnostic(d: LanguageDiagnostic): Sysmlv2Diagnostic {
  // Language: 0-based, Monaco: 1-based.
  const location = {
    severity: d.severity === 'hint' ? ('info' as const) : d.severity,
    startLine: d.range.startLine + 1,
    startColumn: d.range.startCharacter + 1,
    endLine: d.range.endLine + 1,
    endColumn: d.range.endCharacter + 1
  }
  return matchDiagnosticMessage<Sysmlv2Diagnostic>(d.message, {
    plain: (m) => ({ ...location, message: m.text }),
    markdown: (m) => ({ ...location, message: m.text, markdown: m.text })
  })
}

export interface Sysmlv2Diagnostic {
  // Plain text, always present: a Monaco marker can only show a string
  message: string
  // Optional rich version, rendered by the hover provider
  markdown?: string
  severity: 'error' | 'info' | 'warning'
  startLine: number
  endLine: number
  startColumn: number
  endColumn: number
}

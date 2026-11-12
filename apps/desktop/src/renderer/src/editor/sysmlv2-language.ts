import * as monaco from 'monaco-editor'
import { sysmlv2MonarchGrammar } from '@sysmlv2-ide/language'

export const SYSMLV2_LANGUAGE_ID = 'sysmlv2'

export function registerSysmlv2Language(): void {
  monaco.languages.register({ id: SYSMLV2_LANGUAGE_ID, extensions: ['.sysmlv2'] })
  monaco.languages.setLanguageConfiguration(SYSMLV2_LANGUAGE_ID, {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [['{', '}']],
    autoClosingPairs: [{ open: '{', close: '}' }],
    surroundingPairs: [{ open: '{', close: '}' }]
  })
  monaco.languages.setMonarchTokensProvider(
    SYSMLV2_LANGUAGE_ID,
    sysmlv2MonarchGrammar as monaco.languages.IMonarchLanguage
  )
}

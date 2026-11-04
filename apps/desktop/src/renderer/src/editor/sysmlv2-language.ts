import * as monaco from "monaco-editor"

export const SYSMLV2_LANGUAGE_ID = 'sysmlv2'

export function registerSysmlv2Language(): void {
  monaco.languages.register({id: SYSMLV2_LANGUAGE_ID, extensions: ['.sysmlv2']})
  monaco.languages.setLanguageConfiguration(SYSMLV2_LANGUAGE_ID, {
    comments: { lineComment: '//', blockComment: ['/*', '*/']},
    brackets: [['{', '}']],
    autoClosingPairs: [{open: '{', close: '}'}],
    surroundingPairs: [{open: '{', close: '}'}],
  })
  monaco.languages.setMonarchTokensProvider(SYSMLV2_LANGUAGE_ID, {
    keywords: ['package', 'part', 'def', 'connect', 'to'],
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        [/[{};:]/, 'delimiter'],
        [/\s+/, 'white']
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ]
    }
  })
}

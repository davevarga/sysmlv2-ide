export interface PlainMessage {
  readonly kind: "plain";
  readonly text: string;
}

export interface MarkdownMessage {
  readonly kind: "markdown";
  readonly text: string;
}

export type DiagnosticMessage = PlainMessage | MarkdownMessage;

/** ONe handler per kind. Forgetting one is a compile error at the call site. */
export interface DiagnosticMessageVisitor<R> {
  plain: (message: PlainMessage) => R;
  markdown: (message: MarkdownMessage) => R;
}

/** The only place that switches on 'kind'. Everywhere else passes handlers */
export function matchDiagnosticMessage<R>(
  message: DiagnosticMessage,
  visitor: DiagnosticMessageVisitor<R>,
): R {
  switch (message.kind) {
    case "plain":
      return visitor.plain(message);
    case "markdown":
      return visitor.markdown(message);
    default:
      return assertNever(message);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled diagnostic message: ${JSON.stringify(value)}`);
}

export interface LanguageDiagnostic {
  message: DiagnosticMessage;
  severity: "error" | "warning" | "info" | "hint";
  /** 0-based, as in the Language Server Protocol. */
  range: {
    startLine: number;
    startCharacter: number;
    endLine: number;
    endCharacter: number;
  };
}
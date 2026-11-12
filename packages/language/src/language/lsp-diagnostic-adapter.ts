import type { LangiumDocument } from "langium";
import type { DiagnosticMessage, LanguageDiagnostic } from "./diagnostic";

type LspDiagnostic = NonNullable<LangiumDocument["diagnostics"]>[number];
type LspMessage = LspDiagnostic["message"];

const SEVERITIES = { 1: "error", 2: "warning", 3: "info", 4: "hint" } as const


/** The only code that knows LSP's `string | MarkupContent`. */
function fromLspMessage(message: LspMessage): DiagnosticMessage {
  if (typeof message === "string") {
    return { kind: "plain", text: message };
  }
  switch (message.kind) {
    case "plaintext":
      return { kind: "plain", text: message.value };
    case "markdown":
      return { kind: "markdown", text: message.value };
  }
}

export function toLanguageDiagnostic(d: LspDiagnostic): LanguageDiagnostic {
  return {
    message: fromLspMessage(d.message),
    severity: SEVERITIES[d.severity ?? 1],
    range: {
      startLine: d.range.start.line,
      startCharacter: d.range.start.character,
      endLine: d.range.end.line,
      endCharacter: d.range.end.character,
    },
  };
}
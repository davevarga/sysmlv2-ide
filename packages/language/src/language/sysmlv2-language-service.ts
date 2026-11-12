import { URI, type LangiumSharedCoreServices } from "langium"
import { createSysMLv2Services } from "./sysmlv2-module.js"
import type { LanguageDiagnostic } from "./diagnostic.js"
import { toLanguageDiagnostic } from "./lsp-diagnostic-adapter.js"

export interface AnalysisResult {
  diagnostics: LanguageDiagnostic[];
}

const DOCUMENT_URI = URI.parse("inmemory://model/main.sysmlv2");

export class Sysmlv2LanguageService {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly shared: LangiumSharedCoreServices = createSysMLv2Services()
      .shared,
  ) {}

  /** Calls are queued, so overlapping edits never touch the document at the same time. */
  analyze(text: string): Promise<AnalysisResult> {
    const result = this.queue.then(() => this.run(text));
    this.queue = result.catch(() => undefined);
    return result;
  }
  private async run(text: string): Promise<AnalysisResult> {
    const { LangiumDocumentFactory, LangiumDocuments, DocumentBuilder } =
      this.shared.workspace;
    if (LangiumDocuments.hasDocument(DOCUMENT_URI)) {
      await DocumentBuilder.update([], [DOCUMENT_URI]); // drop the old version
    }
    const document = LangiumDocumentFactory.fromString(text, DOCUMENT_URI);
    LangiumDocuments.addDocument(document);
    await DocumentBuilder.build([document], { validation: true });
    return {
      diagnostics: (document.diagnostics ?? []).map(toLanguageDiagnostic),
    };
  }
}

import {
  EmptyFileSystem,
  inject,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  type DefaultSharedCoreModuleContext,
  type LangiumCoreServices,
  type LangiumSharedCoreServices
} from 'langium'
import { SysMLGeneratedModule, SysMLGeneratedSharedModule } from './generated/module.js'

export type SysMLServices = LangiumCoreServices

/**
 * Composition root of the language: wires the generated parser/AST with
 * Langium's default services. Custom services (validation, scoping,
 * formatting) are added here later as module overrides.
 *
 * Core services only (no LSP) so the package is usable from tests, the
 * sync engine and the Electron main process without an editor attached.
 */
export function createSysMLServices(context: DefaultSharedCoreModuleContext = EmptyFileSystem): {
  shared: LangiumSharedCoreServices
  SysML: SysMLServices
} {
  const shared = inject(createDefaultSharedCoreModule(context), SysMLGeneratedSharedModule)
  const SysML = inject(createDefaultCoreModule({ shared }), SysMLGeneratedModule)
  shared.ServiceRegistry.register(SysML)
  return { shared, SysML }
}

import {
  EmptyFileSystem,
  inject,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  type DefaultSharedCoreModuleContext,
  type LangiumCoreServices,
  type LangiumSharedCoreServices
} from 'langium'
import { SysMLv2GeneratedModule, SysMLv2GeneratedSharedModule } from './generated/module.js'

export type SysMLv2Services = LangiumCoreServices

/**
 * Composition root of the language: wires the generated parser/AST with
 * Langium's default services. Custom services (validation, scoping,
 * formatting) are added here later as module overrides.
 *
 * Core services only (no LSP) so the package is usable from tests, the
 * sync engine and the Electron maien process without an editor attached.
 */
export function createSysMLv2Services(context: DefaultSharedCoreModuleContext = EmptyFileSystem): {
  shared: LangiumSharedCoreServices
  SysMLv2: SysMLv2Services
} {
  const shared = inject(createDefaultSharedCoreModule(context), SysMLv2GeneratedSharedModule)
  const SysMLv2 = inject(createDefaultCoreModule({ shared }), SysMLv2GeneratedModule)
  shared.ServiceRegistry.register(SysMLv2)
  return { shared, SysMLv2 }
}

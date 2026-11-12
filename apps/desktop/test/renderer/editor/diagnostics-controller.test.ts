import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { LanguageDiagnostic } from '@sysmlv2-ide/language'
import {
  DiagnosticsController,
  type DiagnosticsSource
} from '@renderer/editor/diagnostics-controller'
import { deferred } from '../../support/deferred'
import { FakeDiagnosticsView } from '../../support/fake-diagnostics-view'
import { languageDiagnostic, plainError } from '../../support/language-diagnostics'

const DEBOUNCE_MS = 300

type Analysis = { diagnostics: LanguageDiagnostic[] }

// The language backend is mocked: `analyze` is a spy and nothing here touches Langium.
describe('DiagnosticsController (language backend mocked)', () => {
  let view: FakeDiagnosticsView
  let analyze: Mock<DiagnosticsSource['analyze']>
  let controller: DiagnosticsController

  beforeEach(() => {
    vi.useFakeTimers()
    view = new FakeDiagnosticsView('part def A;')
    analyze = vi.fn<DiagnosticsSource['analyze']>().mockResolvedValue({ diagnostics: [] })
    controller = new DiagnosticsController({ analyze }, view, DEBOUNCE_MS)
  })

  afterEach(() => {
    controller.dispose()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('analyzes the initial text and shows the result with 1-based positions', async () => {
    analyze.mockResolvedValue({ diagnostics: [plainError('boom')] })

    controller.start()
    await vi.advanceTimersByTimeAsync(0)

    expect(analyze).toHaveBeenCalledTimes(1)
    expect(analyze).toHaveBeenCalledWith('part def A;')
    expect(view.shown).toEqual([
      [
        {
          message: 'boom',
          severity: 'error',
          startLine: 1,
          startColumn: 3,
          endLine: 1,
          endColumn: 6
        }
      ]
    ])
  })

  it('clears the markers when the backend reports no problems', async () => {
    analyze.mockResolvedValueOnce({ diagnostics: [plainError('boom')] })
    controller.start()
    await vi.advanceTimersByTimeAsync(0)

    view.type('part def B;')
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS)

    expect(view.shown.at(-1)).toEqual([])
  })

  it('debounces rapid edits into one analysis of the latest text', async () => {
    controller.start()
    await vi.advanceTimersByTimeAsync(0)
    analyze.mockClear()

    view.type('a')
    await vi.advanceTimersByTimeAsync(100)
    view.type('ab')
    await vi.advanceTimersByTimeAsync(100)
    view.type('abc')
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1)
    expect(analyze).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(analyze).toHaveBeenCalledTimes(1)
    expect(analyze).toHaveBeenCalledWith('abc')
  })

  it('drops a stale result that arrives after a newer one', async () => {
    const slow = deferred<Analysis>()
    analyze
      .mockImplementationOnce(() => slow.promise) // initial analysis: slow
      .mockResolvedValueOnce({ diagnostics: [plainError('fresh')] }) // after the edit: fast

    controller.start()
    view.type('part def B;')
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS)
    slow.resolve({ diagnostics: [plainError('stale')] })
    await vi.advanceTimersByTimeAsync(0)

    expect(view.shown).toHaveLength(1)
    expect(view.shown[0]?.[0]?.message).toBe('fresh')
  })

  it('keeps the previous markers, logs, and recovers when the backend fails', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    analyze
      .mockResolvedValueOnce({ diagnostics: [plainError('first')] })
      .mockRejectedValueOnce(new Error('backend down'))
      .mockResolvedValueOnce({ diagnostics: [] })

    controller.start()
    await vi.advanceTimersByTimeAsync(0)
    view.type('x')
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS)

    expect(view.shown).toHaveLength(1)
    expect(log).toHaveBeenCalledTimes(1)

    view.type('y')
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS)
    expect(view.shown).toHaveLength(2)
    expect(view.shown[1]).toEqual([])
  })

  it('passes a markdown message through to the editor', async () => {
    analyze.mockResolvedValue({
      diagnostics: [languageDiagnostic({ message: { kind: 'markdown', text: '**rich**' } })]
    })

    controller.start()
    await vi.advanceTimersByTimeAsync(0)

    expect(view.shown[0]?.[0]).toMatchObject({ message: '**rich**', markdown: '**rich**' })
  })

  it('stops reacting to edits after dispose, including a pending one', async () => {
    controller.start()
    await vi.advanceTimersByTimeAsync(0)
    analyze.mockClear()

    view.type('pending')
    controller.dispose()
    view.type('after dispose')
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS * 2)

    expect(analyze).not.toHaveBeenCalled()
  })
})

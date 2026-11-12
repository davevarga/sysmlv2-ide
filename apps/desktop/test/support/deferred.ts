export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T) => void
}

/** A promise you resolve by hand, to control the order in which async results arrive. */
export function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}

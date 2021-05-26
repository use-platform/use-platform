export function isFn(maybeFn: unknown): maybeFn is Function {
  return typeof maybeFn === 'function'
}

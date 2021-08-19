export function clamp(value: number, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max)
}

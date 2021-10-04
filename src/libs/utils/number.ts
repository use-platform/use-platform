export function clamp(value: number, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max)
}

export function isInRange(value: number, min: number, max: number) {
  return value >= min && value <= max
}

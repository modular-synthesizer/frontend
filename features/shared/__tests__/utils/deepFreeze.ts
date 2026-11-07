export const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}
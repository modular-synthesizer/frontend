export function boundaries(min: number, max: number, key: string, translator: any): (number) => boolean|string {
  return (value: number): boolean|string => {
    return (value >= min && value <= max || translator.t(key, { min, max }));
  }
}
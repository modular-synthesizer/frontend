export function boundaries(min: number, max: number, key: string, translator: any): (n: number) => boolean|string {
  return (value: number): boolean|string => {
    return (value >= min && value <= max || translator.t(key, { min, max }));
  }
}
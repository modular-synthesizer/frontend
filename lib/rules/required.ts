export function required(key: string, translator): (string) => boolean|string {
  return (value: string): boolean|string => {
    return (value.length > 0 || translator.t(key));
  }
}
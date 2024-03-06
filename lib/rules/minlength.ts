export function minlength(length: number, key: string, translator: any): (string) => boolean|string {
  return (value: string): boolean|string => {
    return (value === '' || value.length >= length) ? true : translator.t(key, { length });
  }
}
const debouncers: {[key: string]: any} = { }

export function debounce(name: string, delay: number, callback: Function) {
  if (name in debouncers) clearTimeout(debouncers[name]);
  debouncers[name] = setTimeout(callback, delay);
}
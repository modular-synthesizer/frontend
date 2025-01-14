import { clamp } from "lodash";

export function nextPowerOfTwo(value: number) {
  let result: number = 32;
  do { result **= 2 } while (result < value);
  return clamp(result, 32, 32768);
}
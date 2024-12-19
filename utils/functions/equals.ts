import type { Identified } from "~/types/utils/Identified";

export function equals(first: Identified, second: Identified): boolean {
  return first.id !== undefined && second.id !== undefined && first.id === second.id;
}
import type { ModuleCoordinates } from "~/types/modules/AudioModule";
import type { Identified } from "~/types/utils/Identified";

type Intersectable = ModuleCoordinates & Identified

export function intersect(a: Intersectable, b: Intersectable): boolean {
  return inSameRack(a, b) && !equal(a, b) && (overlap(a, b) || overlap(b, a));
}

function inSameRack(first: ModuleCoordinates, second: ModuleCoordinates): boolean {
  return first.rack === second.rack
}

function equal(first: Identified, second: Identified): boolean {
  return first.id !== undefined && second.id !== undefined && first.id === second.id;
}

function overlap(a: ModuleCoordinates, b: ModuleCoordinates): boolean {
  return a.slot >= b.slot && a.slot < (b.slot + b.slots);
}
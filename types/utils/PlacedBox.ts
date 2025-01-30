import type { Coordinates } from "./Coordinates";
import type { Identified } from "./Identified";

export type PlacedBox = Identified & Coordinates & { width: number, height: number };
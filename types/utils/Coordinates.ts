import type { Identified } from "./Identified";

export type Coordinates = {
    x: number, y: number
};

export type ScaledCoordinates = Coordinates & {
    scale: number;
}

export type PlacedBox = Identified & Coordinates & {
  width: number;
  height: number;
};
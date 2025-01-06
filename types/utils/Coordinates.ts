import type { Identified } from "./Identified";

export type Coordinates = {
    x: number, y: number
};

export type ScaledCoordinates = Coordinates & {
    scale: number;
}

export type Draggable = Identified & Coordinates;
import type { Coordinates } from "~/types/utils/Coordinates";

export function translate(coords: Coordinates) {
  return `translate(${coords.x} ${coords.y})`;
}

export function scale({ scale } : { scale: number }) {
  return `scale(${scale} ${scale})`;
}
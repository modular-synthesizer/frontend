import type { Coordinates } from "~/types/utils/Coordinates";

export interface IStrategy {
  start($event: MouseEvent): void;
  move($event: MouseEvent): void;
  end($event: MouseEvent): void;
  newPosition($event: MouseEvent): Coordinates;
}
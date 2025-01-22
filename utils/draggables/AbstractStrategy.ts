import { clone } from "lodash";
import type { Coordinates } from "~/types/utils/Coordinates";
import type { IStrategy } from "./IStrategy";

export abstract class AbstractStrategy implements IStrategy {
  // The origin coordinates of the item you're dragging.
  public origin: Coordinates = { x: 0, y: 0 };
  // The origin event of the drag.
  protected event!: MouseEvent;

  protected scale: number;

  protected delta: Coordinates = { x: 0, y: 0 };

  protected target: Coordinates;

  public constructor(target: Coordinates, scale: number) {
    this.origin = clone(target);
    this.scale = scale;
    this.target = target;
  }

  public start($event: MouseEvent) {
    this.event = $event;
  }

  public newPosition({ clientX: x, clientY: y }: MouseEvent): Coordinates {
    return {
      x: this.origin.x + (x - this.event.x) / this.scale,
      y: this.origin.y + (y - this.event.y) / this.scale,
    }
  }

  public abstract move($event: MouseEvent): void;

  public abstract end($event: MouseEvent): void;
}
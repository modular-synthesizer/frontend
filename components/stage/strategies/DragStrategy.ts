import type { Coordinates, ScaledCoordinates } from "~/types/utils/Coordinates";

export abstract class DragStrategy {
  // The origin coordinates of the item you're dragging.
  private origin: Coordinates = { x: 0, y: 0 };
  // The origin event of the drag.
  private event!: MouseEvent;

  private scale: number;

  private delta: Coordinates = { x: 0, y: 0 };

  public constructor(target: Coordinates, scale: number) {
    this.origin.x = target.x;
    this.origin.y = target.y;
    this.scale = scale;
  }

  public start($event: MouseEvent) {
    this.event = $event;
  }

  public move({ clientX: x, clientY: y }: MouseEvent): void {
    this.delta.x = this.origin.x + (x - this.event.x) / this.scale;
    this.delta.y = this.origin.y + (y - this.event.y) / this.scale;
  }

  public abstract end($event: MouseEvent): void;
}

export class IdleStrategy extends DragStrategy {
  public end(_$event: MouseEvent): void {
    return;
  }
}
import type { Coordinates } from "~/types/utils/Coordinates";
import type { DragStrategy } from "./DragStrategy";
import type { Stage } from "./useDraggables";

/**
 * This is the strategy implemented to drag an item across the stage and not the others.
 */
export class ItemDragStrategy implements DragStrategy {
  // The stage in which the item is currently dragged.
  private stage: Stage;
  // The item currently being dragged across the stage.
  private item: Coordinates;
  // The coordinates of the event triggering the drag in the first place
  private event!: Coordinates;
  // The original coordinates of the item itself
  private origin: Coordinates;

  private callback: () => void;

  private sx: number;
  private sy: number;

  private collision: (c: Coordinates) => Boolean;

  public constructor(stage: Stage, draggable: Draggable, sx: number = 1, sy: number = 1, collision: (c: Coordinates) => Boolean) {
    this.stage = stage;
    this.item = draggable.item;
    this.sx = sx;
    this.sy = sy;
    this.origin = { x: this.item.x, y: this.item.y }
    this.callback = draggable.callback ?? (() => { })
    this.collision = collision;
  }

  public start($event: MouseEvent): void {
    this.event = this.project($event);
  }

  public move($event: MouseEvent): void {
    const offset: Coordinates = this.project($event);
    offset.x -= this.event.x;
    offset.y -= this.event.y;
    const results: Coordinates = {
      x: this.round(this.origin.x + offset.x, this.sx),
      y: this.round(this.origin.y + offset.y, this.sy),
    }
    if (this.collision(results)) return;
    this.item.x = results.x
    this.item.y = results.y;
  }

  public end(): void {
    this.callback();
  }

  public get panning(): boolean {
    return false;
  }

  private project($event: MouseEvent): Coordinates {
    const { a, scale } = this.stage;
    return {
      x: Math.round(($event.clientX - a.x) / scale),
      y: Math.round(($event.clientY - a.y) / scale),
    }
  }

  private round(value: number, step: number): number {
    const rounded: number = Math.round(value / step) * step;
    return rounded;
  }
}
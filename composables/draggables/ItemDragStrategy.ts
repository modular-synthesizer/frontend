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

  public constructor(stage: Stage, draggable: Draggable, sx: number = 1, sy: number = 1) {
    this.stage = stage;
    this.item = draggable.item;
    this.sx = sx;
    this.sy = sy;
    this.origin = { x: this.item.x, y: this.item.y }
    this.callback = draggable.callback ?? (() => { })
  }

  public start($event: MouseEvent): void {
    this.event = this.project($event);
  }

  public move($event: MouseEvent): void {
    const offset: Coordinates = this.project($event);
    offset.x -= this.event.x;
    offset.y -= this.event.y;
    this.item.x = this.round(this.origin.x + offset.x, this.sx);
    this.item.y = this.round(this.origin.y + offset.y, this.sy);
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
    return Math.round(value / step) * step;
  }
}
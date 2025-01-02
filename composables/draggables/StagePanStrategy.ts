import type { Coordinates } from "~/types/utils/Coordinates";
import type { Stage } from "./useDraggables";

export class StagePanStrategy implements DragStrategy {
  private stage: Stage;
  // The coordinates of the event triggering the drag in the first place
  private event!: Coordinates;

  // The original coordinates of the item itself
  private origin: Coordinates;

  public constructor(stage: Stage) {
    this.stage = stage;
    this.origin = { x: stage.d.x, y: stage.d.y }
  }

  public end(): void {
    if (this.stage.callback) this.stage.callback();
  }

  start($event: MouseEvent): void {
    this.event = this.project($event);
  }
  
  move($event: MouseEvent): void {
    const offset: Coordinates = this.project($event);
    offset.x -= this.event.x;
    offset.y -= this.event.y;
    this.stage.d.x = (this.origin.x + offset.x);
    this.stage.d.y = (this.origin.y + offset.y);
  }

  private project($event: MouseEvent): Coordinates {
    const { a, scale } = this.stage;
    return {
      x: Math.round(($event.clientX - a.x) / scale),
      y: Math.round(($event.clientY - a.y) / scale),
    }
  }

  public get panning(): boolean {
    return true;
  }

  
}
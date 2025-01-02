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
  
  end(): void { }

  start($event: MouseEvent): void {
    this.event = { x: $event.clientX, y: $event.clientY }
  }
  
  move($event: MouseEvent): void {
    const delta: Coordinates = {
      x: $event.clientX - this.event.x,
      y: $event.clientY - this.event.y
    }
    this.stage.d.x = this.origin.x + delta.x;
    this.stage.d.y = this.origin.y + delta.y;
  }

  public get panning(): boolean {
    return true;
  }

  
}
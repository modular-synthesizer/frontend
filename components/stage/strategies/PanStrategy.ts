import { DragStrategy } from "./DragStrategy";

export class PanStrategy extends DragStrategy {
  public override end($event: MouseEvent): void {
    console.log("on end");
  }
}
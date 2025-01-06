import type { Coordinates } from "~/types/utils/Coordinates";
import { AbstractStrategy } from "./AbstractStrategy";

export class PanStrategy extends AbstractStrategy {

  public override move($event: MouseEvent) {
    const position: Coordinates = super.newPosition($event);
    this.target.x = position.x;
    this.target.y = position.y;
  }

  public override end($event: MouseEvent): void {
    console.log("on end");
  }
}
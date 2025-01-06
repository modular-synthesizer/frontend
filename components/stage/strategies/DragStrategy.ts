import type { Coordinates } from "~/types/utils/Coordinates";
import { AbstractStrategy } from "./AbstractStrategy";

export class DragStrategy extends AbstractStrategy {

  private sx: number;
  private sy: number;

  public constructor(target: Coordinates, scale: number, sx: number, sy: number) {
    super(target, scale);
    this.sx = sx;
    this.sy = sy;
  }

  public override move($event: MouseEvent): void {
    const position = this.newPosition($event);
    this.target.x = this.round(position.x, this.sx);
    this.target.y = this.round(position.y, this.sy);
    console.log(this.target.x + ";" + this.target.y);
  }
  public override end($event: MouseEvent): void {
    console.log("end of item drag");
  }

  private round(value: number, step: number): number {
    return Math.round(value / step) * step;
  }
}
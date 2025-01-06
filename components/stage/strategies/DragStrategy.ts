import type { Draggable } from "~/types/utils/Coordinates";
import { AbstractStrategy } from "./AbstractStrategy";

export class DragStrategy extends AbstractStrategy {

  private sx: number;
  private sy: number;
  private id: string;

  public constructor(target: Draggable, scale: number, sx: number, sy: number) {
    super(target, scale);
    this.sx = sx;
    this.sy = sy;
    this.id = target.id;
  }

  public override move($event: MouseEvent): void {
    const position = this.newPosition($event);
    this.target.x = this.round(position.x, this.sx);
    this.target.y = this.round(position.y, this.sy);
  }
  
  public override end($event: MouseEvent): void {
    console.log(this.id);
  }

  private round(value: number, step: number): number {
    return Math.round(value / step) * step;
  }
}
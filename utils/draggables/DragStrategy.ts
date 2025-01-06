import type { Draggable } from "~/types/utils/Coordinates";
import { AbstractStrategy } from "./AbstractStrategy";

export class DragStrategy extends AbstractStrategy {

  private sx: number;
  private sy: number;
  private callback: () => void;

  public constructor(target: Draggable, scale: number, sx: number, sy: number, callback: () => void) {
    super(target, scale);
    this.sx = sx;
    this.sy = sy;
    this.callback = callback;
  }

  public override move($event: MouseEvent): void {
    const position = this.newPosition($event);
    this.target.x = this.round(position.x, this.sx);
    this.target.y = this.round(position.y, this.sy);
  }
  
  public override end(_$event: MouseEvent): void {
    this.callback();
  }

  private round(value: number, step: number): number {
    return Math.round(value / step) * step;
  }
}
import type { Coordinates, PlacedBox } from "~/types/utils/Coordinates";
import { AbstractStrategy } from "./AbstractStrategy";

type Callbacks = Record<string, () => void>;

export class DragStrategy extends AbstractStrategy {

  private sx: number;
  private sy: number;
  private callbacks: Callbacks;
  private lastPosition: Coordinates = { x: 0, y: 0 };

  public constructor(target: PlacedBox, scale: number, sx: number, sy: number, callbacks: Callbacks) {
    super(target, scale);
    this.sx = sx;
    this.sy = sy;
    this.callbacks = callbacks;
  }

  public override move($event: MouseEvent): void {
    const position = this.newPosition($event);
    this.lastPosition.x = this.target.x;
    this.lastPosition.y = this.target.y;

    this.target.x = this.round(position.x, this.sx);
    this.target.y = this.round(position.y, this.sy);
    if (this.target.x !== this.lastPosition.x || this.target.y !== this.lastPosition.y) {
      this.callbacks['moved']();
    }
  }
  
  public override end(_$event: MouseEvent): void {
    this.callbacks['dropped']();
  }

  private round(value: number, step: number): number {
    return Math.round(value / step) * step;
  }
}
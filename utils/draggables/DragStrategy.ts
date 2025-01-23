import type { Coordinates, PlacedBox } from "~/types/utils/Coordinates";
import { AbstractStrategy } from "./AbstractStrategy";
import { some } from "lodash";

type Callbacks = Record<string, () => void>;

function collide(first: PlacedBox, second: PlacedBox): boolean {
  if (first.id === second.id) return false;
  if (first.x >= second.x + second.width) return false;
  if (first.y >= second.y + second.height) return false;
  return true;
}

function collidesWith(tested: PlacedBox, colliders: PlacedBox[]): boolean {
  return some(colliders, (collider: PlacedBox) => {
    return collide(tested, collider) && collide(collider, tested);
  })
}

export class DragStrategy extends AbstractStrategy {

  private sx: number;
  private sy: number;
  private callbacks: Callbacks;
  private lastPosition: Coordinates = { x: 0, y: 0 };
  private collides: PlacedBox[] = [];
  private box: PlacedBox;

  public constructor(target: PlacedBox, scale: number, sx: number, sy: number, collides: PlacedBox[], callbacks: Callbacks) {
    super(target, scale);
    this.sx = sx;
    this.sy = sy;
    this.collides = collides;
    this.callbacks = callbacks;
    this.box = target;
  }

  public override move($event: MouseEvent): void {
    const position = this.newPosition($event);
    const rounded: Coordinates = {
      x: this.round(position.x, this.sx),
      y: this.round(position.y, this.sy)
    }
    this.lastPosition.x = this.target.x;
    this.lastPosition.y = this.target.y;

    // Call collidesWith to avoid collisions
    if (collidesWith({...this.box, ...rounded}, this.collides)) return;

    this.target.x = rounded.x;
    this.target.y = rounded.y;
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
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
  private collides: PlacedBox[] = [];
  private box: PlacedBox;

  private offset: Coordinates = { x: 0, y: 0 }

  public constructor(target: PlacedBox, scale: number, sx: number, sy: number, collides: PlacedBox[], callbacks: Callbacks) {
    super(target, scale);
    this.sx = sx;
    this.sy = sy;
    this.collides = collides;
    this.callbacks = callbacks;
    this.box = target;
  }

  public override start($event: MouseEvent): void {
    super.start($event);
    this.offset.x = this.coords.x - this.target.x;
    this.offset.y = this.coords.y - this.target.y;
  }

  public override move(): void {
    const position = {
      x: this.round(this.coords.x - this.offset.x, this.sx),
      y: this.round(this.coords.y - this.offset.y, this.sy),
    };

    if (position.x === this.target.x && position.y === this.target.y) return;
    if (collidesWith({...this.box, ...position}, this.collides)) return;

    this.target.x = position.x;
    this.target.y = position.y;
    this.callbacks['moved']();
  }
  
  public override end(_$event: MouseEvent): void {
    this.callbacks['dropped']();
  }

  private round(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  // The current coordinates of the mouse in the referential of the stage.
  private get coords(): Coordinates {
    return useCoordinates().state.value;
  }
}
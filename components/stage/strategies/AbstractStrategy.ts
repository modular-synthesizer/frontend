import { clone } from "lodash";
import type { Coordinates } from "~/types/utils/Coordinates";

export abstract class AbstractStrategy implements IStrategy {
  // The origin coordinates of the item you're dragging.
  protected origin: Coordinates = { x: 0, y: 0 };
  // The origin event of the drag.
  protected event!: MouseEvent;

  protected scale: number;

  protected delta: Coordinates = { x: 0, y: 0 };

  protected target: Coordinates;

  public constructor(target: Coordinates, scale: number) {
    this.origin = clone(target);
    this.scale = scale;
    this.target = target;
  }

  public start($event: MouseEvent) {
    this.event = $event;
  }

  public newPosition({ clientX: x, clientY: y }: MouseEvent): Coordinates {
    return {
      x: this.origin.x + (x - this.event.x) / this.scale,
      y: this.origin.y + (y - this.event.y) / this.scale,
    }
  }

  public abstract move($event: MouseEvent): void;

  public abstract end($event: MouseEvent): void;
}

export enum StrategyState { PANNING = 'PANNING', IDLE = 'IDLE', DRAGGING = 'DRAGGING' };

export interface IStrategy {
  start($event: MouseEvent): void;
  move($event: MouseEvent): void;
  end($event: MouseEvent): void;
  newPosition($event: MouseEvent): Coordinates;
}

export class IdleStrategy extends AbstractStrategy {
  public move(_$event: MouseEvent): void { return; }
  public end(_$event: MouseEvent): void { return; }

}

export type DragDeclaration = (target: Coordinates, sx: number, sy: number, $event: MouseEvent) => void;
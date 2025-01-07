import type { Control } from "~/types/tools/Control";
import { AbstractStrategy } from "./AbstractStrategy";
import type { Port } from "~/types/modules/Port";
import { getAbsoluteCoordinates } from "../functions/ports";
import type { Coordinates } from "~/types/utils/Coordinates";

export class LinkCreationStrategy extends AbstractStrategy {

  private port: Port;

  public destination!: Coordinates;

  public constructor(control: Control, port: Port) {
    super({ x: +control.payload.x, y: +control.payload.y }, 1.0);
    this.port = port
    this.origin = getAbsoluteCoordinates(port)
  }

  public override move($event: MouseEvent): void {
    this.destination.x = $event.clientX;
    this.destination.y = $event.clientY;
  }
  public override end($event: MouseEvent): void { }
}
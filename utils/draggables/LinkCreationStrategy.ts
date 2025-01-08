import type { Control } from "~/types/tools/Control";
import { AbstractStrategy } from "./AbstractStrategy";
import type { Port } from "~/types/modules/Port";
import { getAbsoluteCoordinates } from "../functions/ports";
import type { Coordinates } from "~/types/utils/Coordinates";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

type PortsCallback = (origin: Port, destination: Port) => void;

export class LinkCreationStrategy extends AbstractStrategy {

  public readonly port: Port;

  public destination: Coordinates = { x:0, y: 0 };

  public synthesizer: Synthesizer;

  private magnetized: Boolean = false;

  private destinationPort: Port | undefined = undefined;

  private callback: PortsCallback;

  public constructor(control: Control, port: Port, synthesizer: Synthesizer, callback: PortsCallback) {
    super({ x: +control.payload.x, y: +control.payload.y }, 1.0);
    this.port = port
    this.origin = getAbsoluteCoordinates(port);
    this.synthesizer = synthesizer;
    this.callback = callback;
  }

  public override start($event: MouseEvent): void {
    super.start($event);
    const { x, y } = getAbsoluteCoordinates(this.port);
    this.origin.x = x;
    this.origin.y = y;
    this.destination = this.newPosition($event);
  }

  public override move($event: MouseEvent): void {
    if (this.magnetized) return;
    this.destination = this.newPosition($event);
  }

  public override newPosition($event: MouseEvent): Coordinates {
    return {
      x: this.origin.x + ($event.clientX - this.event.x) / this.synthesizer.scale,
      y: this.origin.y + ($event.clientY - this.event.y) / this.synthesizer.scale,
    }
  }

  public magnetize(port: Port): void {
    this.magnetized = true;
    this.destinationPort = port;
    this.destination = getAbsoluteCoordinates(port);
  }

  public unmagnetize(): void {
    this.magnetized = false;
  }
  
  public override end(_$event: MouseEvent): void {
    if (this.destinationPort !== undefined) this.callback(this.port, this.destinationPort)
  }
}
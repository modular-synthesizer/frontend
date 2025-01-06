import { AbstractStrategy } from "./AbstractStrategy";

export class IdleStrategy extends AbstractStrategy {
  public move(_$event: MouseEvent): void { return; }
  public end(_$event: MouseEvent): void { return; }
}
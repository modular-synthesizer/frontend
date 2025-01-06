import type { Control } from "~/types/tools/Control";
import { AbstractStrategy } from "./AbstractStrategy";

export class ParamStrategy extends AbstractStrategy {

  private control: Control;

  public constructor(control: Control) {
    console.log("pouet pouet");
    super({ x: +control.payload.x, y: +control.payload.y }, 1.0)
    this.control = control;
  }

  public override move($event: MouseEvent): void {
    const delta = this.newPosition($event);
    console.log(delta.x);
  }

  public override end($event: MouseEvent): void {
    
  }
  
}
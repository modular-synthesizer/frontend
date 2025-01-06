import type { Control } from "~/types/tools/Control";
import { AbstractStrategy } from "./AbstractStrategy";
import type { Parameter } from "~/types/modules/Parameter";
import { clamp } from "lodash";
import { setValue } from "../functions/parameters";

export class ParamStrategy extends AbstractStrategy {

  private parameter: Parameter;

  private originalValue: number;

  private callback: () => void;

  public constructor(control: Control, parameter: Parameter, callback: () => void) {
    super({ x: +control.payload.x, y: +control.payload.y }, 1.0)
    this.parameter = parameter;
    this.originalValue = parameter.value;
    this.callback = callback;
  }

  public override move($event: MouseEvent): void {
    const delta = Math.round((this.event.y - $event.clientY) / 10);
    const newValue = this.originalValue + delta * this.parameter.step;
    setValue(this.parameter, clamp(newValue, this.parameter.minimum, this.parameter.maximum));
  }

  public override end($event: MouseEvent): void {
    this.callback();
  }
}
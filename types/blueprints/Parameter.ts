import type { Identified } from "../utils/Identified";

export type ToolParameter = Identified & {
  // The different nodes the parameters will have action on.
  targets: Array<string>;
  // The name of the parameter, used to target it with knobs for example.
  name: string;
  // The field on the targetted nodes the parameter will act on.
  field: string;
  // The value given without any prior edition of the user.
  default: number;
  // The minimum and maximum values possible for the parameter.
  minimum: number; maximum: number;
  // The interval betweentwo values when modifying the parameter.
  step: number;
  // The precision when rounding values to display it in controls.
  precision: number;
}
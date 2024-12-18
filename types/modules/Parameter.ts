import type { ToolParameter } from "../tools/Parameter";
import type { AudioModule } from "./AudioModule";

export type Parameter = ToolParameter & {
  // The current value of the parameter to be edited by the user when turning knobs for example.
  value: number;
  // The module in which the parameter is declared.
  mod: AudioModule;
}
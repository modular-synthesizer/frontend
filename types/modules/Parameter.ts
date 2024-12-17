import type Mod from "~/lib/wrappers/Mod";
import type { ToolParameter } from "../tools/Parameter";

export type Parameter = ToolParameter & {
  // The current value of the parameter to be edited by the user when turning knobs for example.
  value: number;
  // The module in which the parameter is declared.
  mod: Mod;
}
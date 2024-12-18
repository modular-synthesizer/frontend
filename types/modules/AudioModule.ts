import type { Identified } from "../utils/Identified";
import type { Channel } from "./Channel";
import type { Parameter } from "./Parameter";
import type { Control } from "../tools/Control";
import type Port from "~/lib/wrappers/Port";

export type Parameters = Record<string, Parameter>;

type ModuleDescription = Identified & {
  type: string;
  ports: Array<Port>;
  controls: Array<Control>;
  slots: number;
  slot: number;
  rack: number;
}

export type ModulePayload = ModuleDescription & {
  parameters: Array<Parameter>,
  channels: Array<Channel>,
}


export type AudioModule = ModuleDescription & {
  parameters: Parameters,
  channels: Array<Channel>
}
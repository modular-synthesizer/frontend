import type { Identified } from "../utils/Identified";
import type { Channel } from "./Channel";
import type { Parameter } from "./Parameter";
import type { Control } from "../tools/Control";
import type Port from "~/lib/wrappers/Port";
import type { InnerLink } from "../tools/InnerLink";
import type { InnerNode } from "../tools/InnerNode";

export type Parameters = Record<string, Parameter>;

export type ModuleCoordinates = Identified & {
  slots: number;
  slot: number;
  rack: number;
}

type ModuleDescription = ModuleCoordinates & {
  type: string;
  ports: Array<Port>;
  controls: Array<Control>;
  category: string;
}

export type ModulePayload = ModuleDescription & {
  parameters: Array<Parameter>;
  nodes: Array<InnerNode>;
  links: Array<InnerLink>;
}


export type AudioModule = ModuleDescription & {
  parameters: Parameters;
  channels: Array<Channel>;
}
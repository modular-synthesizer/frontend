import type { Identified } from "../utils/Identified";
import type { Channel } from "./Channel";
import type { Parameter } from "./Parameter";
import type { Control } from "../tools/Control";
import type Port from "~/lib/wrappers/Port";

export type Parameters = Record<string, Parameter>;

export type HasChannels = { channels: Array<Channel> };

export type AudioModule = Identified & HasChannels & {
  type: string;
  ports: Array<Port>;
  parameters: Parameters;
  controls: Array<Control>;
}

export type ModuleCoordinates = {
  slots: number;
  slot: number;
  rack: number;
}

export type PlacedModule = AudioModule & ModuleCoordinates;
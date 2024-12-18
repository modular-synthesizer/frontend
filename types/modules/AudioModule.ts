import type IPort from "~/lib/interfaces/IPort";
import type { Identified } from "../utils/Identified";
import type { Channel } from "./Channel";
import type { Parameter } from "./Parameter";
import type { Control } from "../tools/Control";

export type Parameters = Record<string, Parameter>;

export type HasChannels = { channels: Array<Channel> };

export type AudioModule = Identified & HasChannels & {
  type: string;
  ports: Array<IPort>;
  parameters: Parameters;
  controls: Array<Control>;
}

export type ModuleCoordinates = {
  slots: number;
  slot: number;
  rack: number;
}

export type PlacedModule = AudioModule & ModuleCoordinates;
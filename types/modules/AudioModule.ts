import type { Identified } from "../utils/Identified";
import type { Channel } from "./Channel";
import type { Parameter } from "./Parameter";
import type { ModControl } from "../blueprints/Control";
import type { InnerLink } from "../blueprints/InnerLink";
import type { InnerNode } from "../blueprints/InnerNode";
import type { ToolPort } from "../blueprints/Port";
import type { Port } from '~/types/modules/Port';
import type { PlacedBox } from "../utils/PlacedBox";

export type Parameters = Record<string, Parameter>;

export type ModuleCoordinates = Identified & {
  slots: number;
  slot: number;
  rack: number;
}

export type ModuleDescription = ModuleCoordinates & {
  type: string;
  controls: Array<ModControl>;
  category: string;
}

export type ModulePayload = ModuleDescription & {
  parameters: Array<Parameter>;
  nodes: Array<InnerNode>;
  links: Array<InnerLink>;
  ports: Array<ToolPort>;
  voices: number;
}

export type AudioModule = ModuleDescription & PlacedBox & {
  parameters: Parameters;
  channels: Array<Channel>;
  ports: Array<Port>;
  deleted: boolean;
}
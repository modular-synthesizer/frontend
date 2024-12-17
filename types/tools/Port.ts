import type { Identified } from "../utils/Identified";

export type PortKind = 'input' | 'output';

export type ToolPort = Identified & {
  // The name of the tool, used to target it usually.
  name: string;
  // The WAA node targetted by this port.
  target: string;
  // The index of this port on the WAA node.
  index: number;
  // Either the port is an input or an output.
  kind: PortKind;
}
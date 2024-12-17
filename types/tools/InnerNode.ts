import type { Coordinates } from "../utils/Coordinates";
import type { Identified } from "../utils/Identified";

export type InnerNode = Identified & Coordinates & {
  // The name of the node, used to create link from and to it.
  name: string;
  // The name of the function used to generate the WAA node.
  generator: string;
  // The number of input ports the WAA node inside has.
  inputs: number;
  // The number of outputs the inside WAA node has.
  outputs: number;
}
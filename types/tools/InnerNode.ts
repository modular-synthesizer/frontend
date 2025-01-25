import type { PlacedBox } from "../utils/Coordinates";

/**
 * An inner node is the representation of an audio node template in a tool.
 * It gives indications on how a node should be created inside all channels.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export type InnerNode = PlacedBox & {
  // The name of the node, used to create link from and to it.
  name: string;
  // The name of the function used to generate the WAA node.
  generator: string;
  // The number of input ports the WAA node inside has.
  inputs: number;
  // The number of outputs the inside WAA node has.
  outputs: number;
}
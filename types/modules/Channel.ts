import type { InnerLink } from "../tools/InnerLink";

export type ChannelNodes = Record<string, AudioNode>;

export type Channel = {
  // The index of a channel is kept here for convenience as he must know it from time to time.
  index: number;
  // The nodes instanciated in this channel as a set of name -> audio node.
  nodes: ChannelNodes;
  // The links between audio nodes, kept here to be able to be disconnected if needed.
  links: Array<InnerLink>;
  // If the channel in the module is currently used (TRUE) or not (FALSE).
  used: boolean;
}
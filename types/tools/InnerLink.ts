import type { Identified } from "../utils/Identified";

export type InnerLink = Identified & {
  // The beginning of the link, used to call the connect node.
  from: InnerLinkEnd;
  // The ending of the link, passed to the connection call.
  to: InnerLinkEnd;
}

export type InnerLinkEnd = {
  // The name of the node at this end of the link.
  node: string;
  // The index at which this link end is connected on the WAA node.
  index: number;
}
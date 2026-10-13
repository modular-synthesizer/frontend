import type { InnerNode } from "../../data/InnerNode.type";

export type ConnectNodesFct = (origin: InnerNode, destination: InnerNode) => void

export const connectNodes: ConnectNodesFct = (origin, destination) => {
  origin.audioNode.connect(destination.audioNode)
}
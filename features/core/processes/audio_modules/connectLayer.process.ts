import type { PolyphonyLayer } from "../../data/AudioModule.type";
import type { InnerLink } from "../../data/InnerLink.type";
import type { InnerNode } from "../../data/InnerNode.type";

export const connectLayer = (layer: PolyphonyLayer, links: InnerLink[]): PolyphonyLayer => {
  links.forEach(link => {
    const origin: InnerNode | undefined = layer.innerNodes.find(n => n.name === link.from.name)
    const destination: InnerNode | undefined = layer.innerNodes.find(n => n.name === link.to.name)

    if (origin && destination) origin.audioNode.connect(destination.audioNode)
  })
  return layer
}
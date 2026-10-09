import type { PolyphonyLayer } from "../../data/AudioModule.type";
import type { InnerLink } from "../../data/InnerLink.type";
import type { CustomAudioNode, InnerNode } from "../../data/InnerNode.type";

export const connectLayer = <T extends CustomAudioNode>(layer: PolyphonyLayer<T>, links: InnerLink[]): PolyphonyLayer<T> => {
  links.forEach(link => {
    const origin: InnerNode<T> | undefined = layer.innerNodes.find(n => n.name === link.from.name)
    const destination: InnerNode<T> | undefined = layer.innerNodes.find(n => n.name === link.to.name)

    if (origin && destination) origin.audioNode.connect(destination.audioNode)
  })
  return layer
}
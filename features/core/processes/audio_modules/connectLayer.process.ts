import type { PolyphonyLayer } from "../../data/AudioModule.type";
import type { InnerLink } from "../../data/InnerLink.type";

export const connectLayer = <T = AudioNode>(layer: PolyphonyLayer<T>, links: InnerLink[]): PolyphonyLayer<T> => {
  return layer
}
import type { InnerLink } from '~~/types/tools/InnerLink';
import InnerAudioNode from "./InnerAudioNode";

/**
 * A polyphony channel is a mono channel used in a node to express one of the voices of the polyphony.
 * This channel is then reproduced a fixed number of times (given by a constant defined in the corresponding
 * file) and each channel can be triggered by a given source.
 */
export default class Channel {
  public readonly index: number;
  public nodes: InnerAudioNode[] = []
  public links: InnerLink[] = []
  public used: Boolean = false;

  constructor(index: number) {
    this.index = index;
  }

  public getNode(name: string) {
    return this.nodes.find((a: InnerAudioNode) => a.name === name);
  }
}
export default class InnerAudioNode {
  public readonly name: string;
  public readonly node: AudioNode;
  
  constructor(name: string, node: AudioNode) {
    this.name = name;
    this.node = node;
  }
}
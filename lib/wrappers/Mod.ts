import { InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";
import Port from "./Port";
import { useGenerators } from "../stores/tools/generators";
import { useAudioContext } from "../stores/audioContext";
import InnerAudioNode from "./InnerAudioNode";

export default class Mod {
  public readonly innerNodes: InnerNode[];
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly inputs: Port[] = []
  public readonly outputs: Port[] = []
  public audioNodes: InnerAudioNode[] = []

  constructor({ rack, slot, slots, type, innerNodes, inputs, outputs }: IModule) {
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.innerNodes = innerNodes;
    this.inputs = inputs.map(input => new Port(input));
    this.outputs = outputs.map(output => new Port(output));

    this.initAudio(innerNodes);
  }

  public initAudio(list: InnerNode[]) {
    const ctx = useAudioContext().context;
    const results = list.map(innerNode => {
      const genFunction = useGenerators().scripts[innerNode.generator];
      const audioNode = genFunction(innerNode.name, ctx);
      return audioNode
    })
    this.audioNodes = results;
  }
}
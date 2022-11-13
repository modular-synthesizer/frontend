import { InnerLink, InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";
import Port from "./Port";
import { useGenerators } from "../stores/tools/generators";
import { useAudioContext } from "../stores/audioContext";
import InnerAudioNode from "./InnerAudioNode";
import { find, flatten } from "lodash"

export default class Mod {
  public readonly id: string;
  public readonly innerNodes: InnerNode[];
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly inputs: Port[] = []
  public readonly outputs: Port[] = []
  public audioNodes: InnerAudioNode[] = []

  constructor({ id, rack, slot, slots, type, innerNodes, innerLinks, inputs, outputs }: IModule) {
    this.id = id;
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.innerNodes = innerNodes;
    this.inputs = inputs.map(input => new Port(input));
    this.outputs = outputs.map(output => new Port(output));

    this.initAudio(innerNodes, innerLinks);
  }

  public initAudio(list: InnerNode[], innerLinks: InnerLink[]) {
    const ctx = useAudioContext().context;
    const results = list.map(innerNode => {
      const genFunction = useGenerators().scripts[innerNode.generator];
      const audioNode = genFunction(innerNode.name, ctx);
      return audioNode
    })
    this.audioNodes = flatten(results);
    console.log(this.audioNodes)
    innerLinks.forEach(link => {
      const from = find(this.audioNodes, {name: link.from.node});
      const to = find(this.audioNodes, {name: link.to.node});

      console.log(this.audioNodes, from, to)

      if (from !== undefined && to !== undefined) {
        from.node.connect(to.node, link.from.index, link.to.index)
      }
    })
  }
}
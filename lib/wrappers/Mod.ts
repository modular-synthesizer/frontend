import { InnerLink, InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";
import Port, { InputPort, OutputPort } from "./Port";
import InnerAudioNode from "./InnerAudioNode";
import InnerNodesFactory from '../factories/InnerNodes'
import InnerLinksFactory from '../factories/InnerLinks'
import { usePorts } from "../stores/mods/ports";

export default class Mod {
  public readonly id: string;
  public readonly innerNodes: InnerNode[];
  public readonly innerLinks: InnerLink[]
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
    this.inputs = inputs.map(input => new InputPort(input, this));
    this.outputs = outputs.map(output => new OutputPort(output, this));

    this.audioNodes = InnerNodesFactory.create(innerNodes)
    this.innerLinks = InnerLinksFactory.link(this.audioNodes, innerLinks);

    usePorts().addPorts([...this.inputs, ...this.outputs]);
  }

  public node(name: string) {
    return this.audioNodes.find((a: InnerAudioNode) => a.name === name)
  }
}
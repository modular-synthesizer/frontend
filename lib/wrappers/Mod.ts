import { InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";
import Port from "./Port";

export default class Mod {
  public readonly innerNodes: InnerNode[];
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly inputs: Port[] = []
  public readonly outputs: Port[] = []

  constructor({ rack, slot, slots, type, innerNodes, inputs, outputs }: IModule) {
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.innerNodes = innerNodes;
    this.inputs = inputs.map(input => new Port(input));
    this.outputs = outputs.map(output => new Port(output));
  }
}
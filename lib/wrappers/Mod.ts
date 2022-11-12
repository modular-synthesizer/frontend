import { InnerNode } from "../interfaces/ITool";
import IModule from "../interfaces/IModule";

export default class Mod {
  public readonly innerNodes: InnerNode[];
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;

  constructor({ rack, slot, slots, type, innerNodes }: IModule) {
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.innerNodes = innerNodes;
  }
}
import IPort from "../interfaces/IPort";
import { RACK_HEIGHT, SLOT_SIZE } from "../utils/constants";
import Mod from "./Mod";

export default abstract class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;
  mod: Mod
  public x: number = 0;
  public y: number = 0;

  constructor({id, index, name, target}: IPort, mod: Mod) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
    this.mod = mod
  }

  abstract isInput(): boolean;

  public connectableTo(port: Port) {
    return this.isInput() === !port.isInput();
  }

  public connect(port: Port) {
    this.audioNode.connect(port.audioNode, this.index, port.index);
  }

  public get audioNode(): AudioNode {
    return this.mod.audioNodes.find(n => n.name === this.target).node;
  }

  public get ax() {
    return this.x + this.mod.slot * SLOT_SIZE;
  }
  public get ay() {
    return this.y + this.mod.rack * RACK_HEIGHT;
  }
}

export class InputPort extends Port {
  public isInput(): boolean {
    return true;
  }
}

export class OutputPort extends Port {
  public isInput(): boolean {
    return false;
  }
}
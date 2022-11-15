import IPort from "../interfaces/IPort";
import Mod from "./Mod";

export default abstract class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;
  mod: Mod

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
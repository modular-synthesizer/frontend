import IPort from "../interfaces/IPort";

export default abstract class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;

  constructor({id, index, name, target}: IPort) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
  }

  abstract isInput(): boolean;

  public connectableTo(port: Port) {
    return this.isInput() === !port.isInput();
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